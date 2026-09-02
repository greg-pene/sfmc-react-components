import * as utils from '../libs/utils';
import { default as wfo } from 'webfontloader';
// import jest from 'jest';

describe('utils deltaToFabric', () => {
  let iTextMock;
  beforeEach(() => {
    iTextMock = {
      setSelectionStyles: jest.fn(),
      setSubscript: jest.fn(),
      setSuperscript: jest.fn(),
      canvas: {
        renderAll: jest.fn(),
        requestRenderAll: jest.fn()
      },
      set: jest.fn()
    };
  });

  it('test bold', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { bold: true } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith({ fontWeight: 'bold' }, 0, 7);
  });
  it('test strike', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { strike: true } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith({ linethrough: true }, 0, 7);
  });
  it('test italic', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { italic: true } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith({ fontStyle: 'italic' }, 0, 7);
  });
  it('test superscript', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { script: 'super' } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSuperscript).toHaveBeenCalledWith(0, 7);
  });
  it('test subscript', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { script: 'sub' } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSubscript).toHaveBeenCalledWith(0, 7);
  });
  it('test color', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { color: '#000000' } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith({ fill: '#000000' }, 0, 7);
  });
  it('test background color', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { background: '#000000' } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith(
      { textBackgroundColor: '#000000' },
      0,
      7
    );
  });
  it('test size', () => {
    const delta = {
      ops: [{ retain: 7, attributes: { size: '10px' } }]
    };
    utils.deltaToFabric(delta, iTextMock);
    expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith({ fontSize: 10 }, 0, 7);
  });
  it('test font', () => {
    jest.spyOn(wfo, 'load').mockImplementation((arg) => {
      expect(arg.google.families).toEqual(['test font']);
      arg.active();
      expect(iTextMock.setSelectionStyles).toHaveBeenCalledWith({ fontFamily: 'test font' }, 0, 7);
      //expect(iTextMock.canvas.requestRenderAll).toHaveBeenCalled();
    });
    const delta = {
      ops: [{ retain: 7, attributes: { font: 'test--font' } }]
    };
    utils.deltaToFabric(delta, iTextMock);
  });
});

describe('misc tests', () => {
  it('test overlay object styles', () => {
    const o = {};
    utils.setOverlayObjStyle(o);
    const expected = {
      cornerStyle: 'circle',
      cornerColor: '#005CE4',
      cornerStrokeColor: '#005CE4',
      borderColor: '#005CE4',
      selectionBackgroundColor: 'rgba(0, 92, 230, 0.3)',
      cornerSize: 5,
      selectable: true
    };
    expect(o).toEqual(expected);
  });
});
