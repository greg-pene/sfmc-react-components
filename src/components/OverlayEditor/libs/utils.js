import { default as wfo } from 'webfontloader';
import { default as Delta } from 'quill-delta';
// Core Functions
export const getActiveStyle = (styleName, activeObject, defaults) => {
  if (!activeObject) {
    return '';
  }
  return activeObject.getSelectionStyles && activeObject.isEditing
    ? activeObject.getSelectionStyles()[styleName] || defaults[styleName]
    : activeObject[styleName] || defaults[styleName];
};

export const setActiveStyle = (styleName, value, activeObject) => {
  if (!activeObject) {
    return;
  }

  if (activeObject.setSelectionStyles && activeObject.isEditing) {
    let style = {};
    style[styleName] = value;
    activeObject.setSelectionStyles(style);
    activeObject.setCoords();
  } else {
    activeObject.set(styleName, value);
  }

  activeObject.setCoords();
  activeObject.canvas.renderAll();
};

export const getActiveProp = (name, activeObject) => {
  if (!activeObject) {
    return '';
  }
  return activeObject[name] || '';
};

export const setActiveProp = (name, value, activeObject) => {
  if (!activeObject) {
    return;
  }
  activeObject.set(name, value).setCoords();
  activeObject.canvas.renderAll();
};

function attributes2Styles(attributes, itext, start, end = null) {
  itext.set('dirty', true);
  if (end === null) {
    end = start + 1;
  }
  let fonts = [];
  if (attributes) {
    Object.keys(attributes).forEach((att) => {
      switch (att) {
        case 'bold':
          itext.setSelectionStyles({ fontWeight: 'bold' }, start, end);
          break;
        case 'strike':
          itext.setSelectionStyles({ linethrough: true }, start, end);
          break;
        case 'italic':
          itext.setSelectionStyles({ fontStyle: 'italic' }, start, end);
          break;
        case 'script':
          attributes[att] === 'sub'
            ? itext.setSubscript(start, end)
            : itext.setSuperscript(start, end);
          break;
        case 'font':
          // eslint-disable-next-line no-case-declarations
          let font = attributes[att].replace(/--/g, ' ');
          itext.setSelectionStyles({ fontFamily: font }, start, end);
          fonts.push(font);
          break;
        case 'color':
          itext.setSelectionStyles({ fill: attributes[att] }, start, end);
          break;
        case 'background':
          itext.setSelectionStyles({ textBackgroundColor: attributes[att] }, start, end);
          break;
        case 'size':
          // eslint-disable-next-line no-case-declarations
          let s = attributes[att].replace('px', '');
          itext.setSelectionStyles({ fontSize: Number(s) }, start, end);
          break;
        default:
          itext.setSelectionStyles(attributes, start, end);
      }
    });
    if (fonts.length > 0) {
      wfo.load({
        google: { families: fonts },
        active: () => {
          itext.set('dirty', true);
          if (itext.canvas) {
            itext.canvas.requestRenderAll.bind(itext.canvas); // Update canvas after font loaded.
          }
        }
      });
    }
    if (itext.canvas) {
      itext.canvas.requestRenderAll.bind(itext.canvas); // Update canvas after font loaded.
    }
  }
}

export function extractFontsFromQuill({ ops }) {
  let fonts = [];
  ops.forEach(function (entry) {
    if (entry['attributes'] && entry['attributes'].font) {
      fonts.push(entry['attributes'].font.replace(/--/g, ' '));
    }
  });
  return fonts;
}

export function loadGoogleFonts(fonts, opts) {
  wfo.load({
    google: { families: fonts },
    active: function () {
      console.log('active');
    }
  });
}

export function reapplyDelta(itext) {
  delete itext.styles;
  itext.styles = {};
  itext.dirty = true;
  const d = new Delta(itext.quill);
  let position = 0;
  d.forEach((op) => {
    let txt = op.insert;
    if (txt && !txt.startsWith('\\')) {
      let start = position;
      let end = position + txt.length;
      if (op.attributes) {
        attributes2Styles(op.attributes, itext, start, end);
      }
      position = end;
    }
  });
}

export const deltaToFabric = (delta, itext) => {
  if (delta && delta.ops && delta.ops.length > 1) {
    let retain = delta.ops[0]['retain'];
    let op = Object.keys(delta.ops[1]).shift();
    if (op === 'insert') {
      if (delta.ops[1].attributes) {
        attributes2Styles(delta.ops[1].attributes, itext, retain);
      }
    } else if (op === 'retain') {
      attributes2Styles(delta.ops[1].attributes, itext, retain, retain + delta.ops[1]['retain']);
    }
  } else {
    let op = Object.keys(delta.ops[0]).shift();
    let retain = delta.ops[0]['retain'];
    if (op === 'retain') {
      attributes2Styles(delta.ops[0].attributes, itext, 0, retain);
    }
  }
};

export const align = (canvas, direction) => {
  if (canvas.getActiveObjects().length > 1) {
    let group = canvas.getActiveObject();

    let g = canvas.getActiveObjects();
    g.sort(sortByClickTime);
    const anchorCords = {
      top: g[0].getBoundingRect().top,
      left: g[0].getBoundingRect().left,
      right: g[0].getBoundingRect().left + g[0].getBoundingRect().width,
      bottom: g[0].getBoundingRect().top + g[0].getBoundingRect().height,
      middle: g[0].getBoundingRect().top + g[0].getBoundingRect().height / 2,
      center: g[0].getBoundingRect().left + g[0].getBoundingRect().width / 2
    };
    const numOfLayers = g.length;
    switch (direction.value) {
      case 'left':
        for (let i = 1; i < numOfLayers; i++) {
          g[i].set({
            left: g[0].getBoundingRect().left,
            originX: 'left'
          });
          g[i].setCoords();
        }
        break;
      case 'top':
        for (let i = 1; i < numOfLayers; i++) {
          g[i].set({
            top: g[0].getBoundingRect().top
          });
          g[i].setCoords();
        }
        break;
      case 'right':
        for (let i = 1; i < numOfLayers; i++) {
          g[i].set({
            left: anchorCords.right - g[i].getBoundingRect().width
          });
          g[i].setCoords();
        }
        break;
      case 'bottom':
        for (let i = 1; i < numOfLayers; i++) {
          g[i].set({
            top: anchorCords.bottom - g[i].getBoundingRect().height
          });
          g[i].setCoords();
        }
        break;
      case 'middle':
        for (let i = 1; i < numOfLayers; i++) {
          g[i].set({
            top: anchorCords.middle - g[i].getBoundingRect().height / 2
          });
          g[i].setCoords();
        }
        break;
      case 'center':
        for (let i = 1; i < numOfLayers; i++) {
          g[i].set({
            left: anchorCords.center - g[i].getBoundingRect().width / 2
          });
          g[i].setCoords();
        }
        break;
    }
    group.forEachObject(function (item) {
      group.removeWithUpdate(item).addWithUpdate(item);
    });
    group.setCoords();
    canvas.renderAll();
  }
};

const sortByClickTime = (a, b) => {
  return a.selectTime - b.selectTime;
};

export async function setCanvasSize(img, c) {
  const aspectRatio = img.height / img.width;
  const newWidth = Math.min(c.width, c.height / aspectRatio);
  const scaleFactor = newWidth / img.width;
  const newHeight = c.height > img.height * scaleFactor ? img.height * scaleFactor : c.height;

  // Resize the canvas
  c.setDimensions({ width: newWidth, height: newHeight });

  img.set({
    scaleX: scaleFactor,
    scaleY: scaleFactor,
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top'
  });
  c.backgroundImage = img;

  c.requestRenderAll();
}

export function setOverlayObjStyle(obj) {
  obj.cornerStyle = 'circle';
  obj.cornerColor = '#005CE4';
  obj.cornerStrokeColor = '#005CE4';
  obj.borderColor = '#005CE4';
  obj.selectionBackgroundColor = 'rgba(0, 92, 230, 0.3)';
  obj.cornerSize = 5;
  obj.selectable = true;
}

export function addSelectTime(o) {
  o.on('selected', (ev) => {
    ev.target.selectTime = Date.now();
  });
}
