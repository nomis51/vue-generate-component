import path from 'path';
import swig from 'swig';
import fs from 'fs-extra';
import config from './config/config';

/**
 * TemplateGenerator
 */
class TemplateGenerator {
  /**
   * Todo: Inject swig, fs and config to mock them in the future tests
   * @param options
   */
  constructor(options) {
    this.TEMPLATES_DIR = `${__dirname}/blueprints`;
    this._create(options);
  }

  /**
   *
   * @param options
   * @private
   */
  _create(options = {}) {
    const { name, type, actions, postfix, classExtension } = options;
    const { filesType, dest } = config.getConfigFile()

    if (options.isDir) {
      this._createDirectory(this._getDirPath(type), { name, actions, filesType, postfix, dest, classExtension }, filesType);
    } else {
      const tpl = this._compileTpl(this._getSingleTpl(type), { name, postfix, actions, filesType, classExtension });
      this._createFile(name, type, filesType.script, tpl);
    }
  }

  /**
   *
   * @param file
   * @param data
   * @returns {*}
   * @private
   */
  _compileTpl(file, { name, actions, filesType, postfix, classExtension }) {
    const compiled = swig.compileFile(file);
    return compiled({ name, actions, filesType, postfix, classExtension });
  }

  /**
   *
   * @param name
   * @param fileType
   * @param type
   * @param tpl
   * @private
   */
  _createFile(name, type, fileType, tpl) {
    fs.outputFile(this._createFilePath(name, type, fileType), tpl, function (err) {
      if (err) console.error(err);
    });
  }

  /**
   *
   * @param dirPath
   * @param fileType
   * @param data
   * @private
   */
  _createDirectory(dirPath, data, fileTypes) {
    fs.readdir(dirPath, (err, dir) => {
      let name = data.name;
      let dest = data.dest;

      let folder = path.join(process.cwd(), dest, name);
      let splitIdx = folder.lastIndexOf('/');
      if (splitIdx > -1) {
        name = folder.slice(splitIdx + 1);
        data.name = folder.slice(splitIdx + 1);
      }

      let filePath;

      dir.forEach(tempFile => {
        const compiled = this._compileTpl(`${dirPath}/${tempFile}`, data);
        let fileName = this._createFileName(tempFile, name, fileTypes, data.postfix);
        let innerFileName = this._createFileName(tempFile, name, fileTypes); // for file inside folders ignore postfix to avoid long names
        const isTestFile = tempFile.includes('test')
        const isStoreFile = tempFile.includes('actions') || tempFile.includes('mutations') || tempFile.includes('getters') || tempFile.includes('store')

        if (isTestFile) {
          filePath = path.join(folder, '__tests__', innerFileName)
        }
        else if (isStoreFile) {
          filePath = path.join(folder, 'store', innerFileName)
        }
        else {
          filePath = path.join(folder, fileName)
        }

        fs.outputFile(filePath, compiled, function (err) {
          if (err) console.error(err);
        });
      });
    });
  }

  /**
   *
   * @param tempFile
   * @param name
   * @param fileTypes
   * @returns {*}
   * @private
   */
  _createFileName(tempFile, name, fileTypes, postfix) {
    let newName = postfix ? tempFile.replace(/temp/, name + '.' + postfix) : tempFile.replace(/temp/, name)

    if (newName.indexOf('tpl') > -1) {
      newName = newName.replace(/tpl./, '');
      newName = newName.replace(/extension/, fileTypes.html);
    }

    if (newName.indexOf('sty') > -1) {
      newName = newName.replace(/sty./, '');
      newName = newName.replace(/extension/, fileTypes.style);
    }

    if (newName.indexOf('script') > -1) {
      newName = newName.replace(/script./, '');
      newName = newName.replace(/extension/, fileTypes.script);
    }

    if (newName.indexOf('test') > -1) {
      newName = newName.replace(/extension/, fileTypes.test);
    }

    if (newName.indexOf('store') > -1) {
      newName = newName.replace(/extension/, fileTypes.store);
    }

    if (newName.indexOf('mutations') > -1) {
      newName = newName.replace(/extension/, fileTypes.mutations);
    }

    if (newName.indexOf('actions') > -1) {
      newName = newName.replace(/extension/, fileTypes.actions);
    }

    if (newName.indexOf('getter') > -1) {
      newName = newName.replace(/extension/, fileTypes.getters);
    }


    return newName;
  }

  /**
   *
   * @param type
   * @param extension
   * @returns {*}
   * @private
   */
  _getSingleTpl(type, extension = 'js') {
    if (type === 'single') {
      return `${this.TEMPLATES_DIR}/${type}/temp.vue`;
    }
    return `${this.TEMPLATES_DIR}/${type}/temp.${type}.${extension}`;
  }

  /**
   *
   * @param type
   * @returns {*}
   * @private
   */
  _getDirPath(type) {
    return `${this.TEMPLATES_DIR}/${type}`;
  }

  /**
   *
   * @param name
   * @param type
   * @param fileType
   * @returns {*}
   * @private
   */
  _createFilePath(name, type, fileType) {
    if (type === 'single') {
      return path.join(process.cwd(), `${name}.vue`);
    }
    return path.join(process.cwd(), `${name}.${type}.${fileType}`);
  }
}

export default TemplateGenerator;
