import React, {
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
  useLayoutEffect
} from 'react';
import types from 'prop-types';
import cx from 'classnames';
import t from '../../services/i18n';
import { FabricContext } from './context/FabricContext';
import ReactSlider from 'react-slider';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import ColorPicker from '../ColorPicker';
import fontSizes from './fontSizes';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { deltaToFabric, reapplyDelta } from './libs/utils';
import fonts from './fonts.json';

import { GrLinkBottom, GrLinkTop } from 'react-icons/gr';
import { AiFillCaretUp } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { MdImage, MdTextFields } from 'react-icons/md';

import { IoMdColorFill } from 'react-icons/io';
import { BiFont } from 'react-icons/bi';

const fontsList = fonts.map((font) => {
  return { label: font, value: font.replace(/\s/g, '--') };
});

const fontSizeList = fontSizes(16, 84, 4);

const Quill = ReactQuill.Quill;

let Font = Quill.import('formats/font');
Font.whitelist = fontsList.map((f) => f.value);
Quill.register(Font, true);

let Size = Quill.import('attributors/style/size');
Size.whitelist = null;
Quill.register(Size, true);

FabricLayerToolbar.propTypes = {
  id: types.string.isRequired,
  obj: types.object.isRequired
};

function FabricLayerToolbar(props) {
  const DEFAULT_COLOR = '#000000';
  const DEFAULT_BACKGROUND_COLOR = 'transparent';
  const { canvas, removeLayer, dirty, setLayers } = useContext(FabricContext);
  const [expanded, setExpanded] = useState(true);
  const [opacity, setOpacity] = useState(props.obj.opacity * 100 || 70);
  const [text, setText] = useState(props.obj.text);
  const quillRef = useRef(null);
  const fontRef = useRef(null);
  const fontSizeRef = useRef(null);
  const fontColorRef = useRef(DEFAULT_COLOR);
  const backgroundColorRef = useRef(DEFAULT_BACKGROUND_COLOR);
  const layerRef = useRef(null);

  const handleChange = useCallback(
    (name, value) => {
      if (quillRef.current) {
        quillRef.current.getEditor().format(name, value, 'api');
        dirty.current = true;
      }
    },
    [quillRef]
  );

  useEffect(() => {
    return () => {
      quillRef.current = null;
      fontRef.current = null;
      fontSizeRef.current = null;
      fontColorRef.current = '';
      backgroundColorRef.current = '';
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    props.obj.on('selected', () => {
      layerRef.current.classList.add('active');
    });
    props.obj.on('deselected', () => {
      layerRef.current.classList.remove('active');
    });
    return () => {
      props.obj.off('selected');
      props.obj.off('deselected');
    };
  }, [props.obj]);
  const DEFAULT_FONT = fontsList[0];
  const DEFAULT_FONT_SIZE = props.obj.fontSize;

  const Toolbar = useCallback(() => {
    return (
      <div id={'toolbar' + props.id} className="ql-toolbar">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <ColorPicker
          color={fontColorRef.current}
          onChange={(val) => handleChange('color', val)}
          className="ql-picker"
          icon={<BiFont />}
        />
        <ColorPicker
          color={backgroundColorRef.current}
          onChange={(val) => handleChange('background', val)}
          className="ql-picker"
          icon={<IoMdColorFill />}
        />
        {/* <select className="ql-background"></select> */}
        <Select
          ref={(ref) => {
            fontRef.current = ref;
          }}
          className={'ql-font ql-picker font-list'}
          defaultValue={DEFAULT_FONT}
          options={fontsList}
          onChange={(val) => handleChange('font', val.value)}
          classNamePrefix
        />
        <Creatable
          ref={(ref) => {
            fontSizeRef.current = ref;
          }}
          className="ql-size ql-picker"
          defaultValue={fontSizeList.find((i) => i.label === props.obj.fontSize)}
          options={fontSizeList}
          onChange={(val) => handleChange('size', val.value)}
          innerRef={fontSizeRef}
          classNamePrefix
        />
      </div>
    );
  }, [handleChange]);

  const modules = {
    toolbar: {
      container: '#toolbar' + props.id
    }
  };

  let title;
  let layerType;
  if (props.obj) {
    if (props.obj.type === 'image') {
      title = props.obj.publicId;
      layerType = 'image';
    } else {
      title = props.obj.text;
      layerType = 'text';
    }
  }
  const handleTextChange = (content, delta, source, editor) => {
    let t = editor.getText();
    setText(t);
    props.obj.text = t.trim();
    props.obj.quill = editor.getContents();
    reapplyDelta(props.obj);
    if (canvas) {
      canvas.renderAll();
      dirty.current = true;
    }
  };

  const handleEditorFocus = useCallback(
    (el) => {
      if (el) {
        layerRef.current.classList.add('active');
        canvas.setActiveObject(props.obj);
      }
    },
    [canvas]
  );
  const handleEditorFocusOut = useCallback(
    (el) => {
      if (el) {
        layerRef.current.classList.remove('active');
        canvas.discardActiveObject();
      }
    },
    [canvas]
  );

  const handleSelectChange = useCallback(
    (range, source, editor) => {
      if (quillRef.current && range && source === 'user') {
        let format = quillRef.current.getEditor().getFormat(range);
        if (Object.keys(format).length > 0) {
          if (format.font) {
            fontRef.current.setValue({ label: format.font, value: format.font });
          }
          if (format.size) {
            fontSizeRef.current.setValue({
              label: format.size.replace('px', ''),
              value: format.size + 'px'
            });
          }
          if (format.color) {
            fontColorRef.current = format.color;
          }
          if (format.background) {
            backgroundColorRef.current = format.background;
          }
        } else {
          fontRef.current.setValue({
            label: fontRef.current.getOptionLabel(DEFAULT_FONT),
            value: DEFAULT_FONT
          });
          fontSizeRef.current.setValue({
            label: DEFAULT_FONT_SIZE,
            value: DEFAULT_FONT_SIZE + 'px'
          });
          fontColorRef.current = DEFAULT_COLOR;
          backgroundColorRef.current = DEFAULT_BACKGROUND_COLOR;
        }
      }
    },
    [quillRef, fontRef, fontSizeRef, backgroundColorRef, fontColorRef]
  );

  const toggleLayer = () => {
    setExpanded(!expanded);
  };

  const handleRemove = useCallback(() => {
    removeLayer(props.obj.id);
    canvas.remove(props.obj);
  }, [props.obj, canvas]);

  const syncLayersWithCanvas = useCallback(() => {
    if (!canvas) return;
    const canvasObjects = canvas.getObjects();
    setLayers((currentLayers) => {
      const layerMap = new Map(currentLayers.map((l) => [l.props.id, l]));
      return canvasObjects
        .filter((obj) => layerMap.has(obj.id))
        .map((obj) => layerMap.get(obj.id))
        .reverse();
    });
  }, [canvas, setLayers]);

  const toFront = useCallback(() => {
    if (canvas) {
      canvas.bringObjectForward(props.obj);
      syncLayersWithCanvas();
      dirty.current = true;
    }
  }, [canvas, props.obj, syncLayersWithCanvas]);
  const toBack = useCallback(() => {
    if (canvas) {
      canvas.sendObjectBackwards(props.obj);
      syncLayersWithCanvas();
      dirty.current = true;
    }
  }, [canvas, props.obj, syncLayersWithCanvas]);

  const setObjectOpacity = useCallback(
    (opacity) => {
      let op = opacity / 100;
      props.obj.set({
        opacity: op
      });
      if (canvas) {
        canvas.renderAll();
        dirty.current = true;
      }
      setOpacity(op);
    },
    [props.obj]
  );
  return (
    <div
      className="layer"
      ref={layerRef}
      onMouseOver={(e) => handleEditorFocus(e)}
      onMouseOut={(e) => handleEditorFocusOut(e)}
    >
      <div className={cx('layer-toolbar', { expanded: expanded })}>
        <span className="type-icon">
          {layerType === 'image' ? <MdImage /> : layerType === 'text' && <MdTextFields />}
        </span>
        <span className="title">{title}</span>
        <button className="to-front btn btn-secondary" title={t('toFront')} onClick={toFront}>
          <GrLinkTop />
        </button>
        <button className="to-back btn btn-secondary" title={t('toBack')} onClick={toBack}>
          <GrLinkBottom />
        </button>
        <button
          className="remove btn btn-secondary"
          title={t('labels.removeOverlay')}
          onClick={handleRemove}
        >
          <FaTrash />
        </button>
        <button className="toggle btn btn-secondary" title={t('toggle')} onClick={toggleLayer}>
          <AiFillCaretUp />
        </button>
      </div>

      <div className={cx('layer-content', { hidden: !expanded })}>
        {layerType === 'image' && (
          <div className="opacity">
            <label className="opacity-label">
              {t('labels.opacity')}
              <ReactSlider
                className="horizontal-slider"
                defaultValue={opacity}
                onChange={setObjectOpacity}
              />
            </label>
          </div>
        )}
        {layerType === 'text' && (
          <div className="text-editor">
            <Toolbar />
            <ReactQuill
              ref={quillRef}
              theme="snow"
              defaultValue={props.obj.quill || text}
              onChange={handleTextChange}
              // onFocus={handleEditorFocus}
              onChangeSelection={handleSelectChange}
              modules={modules}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FabricLayerToolbar;
