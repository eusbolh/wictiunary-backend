module.exports = class ObjectUtil {
  static omit(obj, omittedKeys) {
    return Object.keys(obj)
      .filter((key) => omittedKeys.indexOf(key) < 0)
      .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
  }

  static pick(obj, pickedKeys) {
    return Object.keys(obj)
      .filter((key) => pickedKeys.indexOf(key) >= 0)
      .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
  }
};
