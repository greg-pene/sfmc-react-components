export default {
  isNotRestricted: (args) => {
    const { asset } = args;
    return new Promise((resolve, reject) => {
      fetch(asset.secure_url, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            resolve();
          } else {
            reject('restricted');
          }
        })
        .catch(() => {
          reject('restricted');
        });
    });
  },
  isNotOverSizeLimit: (args) => {
    const { asset, sizeLimit } = args;
    return new Promise((resolve, reject) => {
      if (asset.bytes / 1024 / 1024 < sizeLimit) {
        resolve();
      } else {
        reject('tooBig');
      }
    });
  },
  isRightType: (args) => {
    const { asset, rightType } = args;
    return new Promise((resolve, reject) => {
      if (asset.resource_type === rightType && asset.resource_type !== 'raw') {
        resolve();
      } else {
        reject('wrongType');
      }
    });
  },
  hasDimensions: (args) => {
    const { asset } = args;
    return new Promise((resolve, reject) => {
      if (asset.height > 0 && asset.width > 0) {
        resolve();
      } else {
        reject('noDimensions');
      }
    });
  }
};
