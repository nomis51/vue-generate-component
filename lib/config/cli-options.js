export default [
  {
    name: 'help',
    type: Boolean,
    group: 'options',
    description: 'help'
  },
  {
    name: 'html',
    type: String,
    group: 'options',
    description: 'set the default html templates'
  },
  {
    name: 'all',
    type: String,
    group: 'options',
    description: 'set all files to typescript'
  },
  {
    name: 'script',
    type: String,
    group: 'options',
    description: 'set the default script language'
  },
  {
    name: 'component',
    alias: 'c',
    type: String,
    group: 'options',
    description: 'generate Vue js component',
    defaultOption: true
  },
  {
    name: 'spec',
    type: String,
    group: 'options',
    description: 'set the default spec language'
  },
  {
    name: 'style',
    type: String,
    group: 'options',
    description: 'set the default style file'
  },
  {
    name: 'directive',
    alias: 'd',
    type: String,
    group: 'options',
    description: 'generate Vue js directive'
  },
  {
    name: 'single',
    alias: 's',
    type: String,
    group: 'options',
    description: 'generate Vue js component single file'
  },
  {
    name: 'folder',
    alias: 'f',
    type: Boolean,
    group: 'options',
    description: 'generate Vue js component single file inside new folder'
  },
  {
    name: 'postfix',
    type: String,
    group: 'options',
    description: 'create postfix in file name'
  },
  {
    name: 'classExtension',
    type: String,
    group: 'options',
    description: 'if provided will replace default extension for pages with whatever name provided to this option'
  },
  {
    name: 'dest',
    type: String,
    group: 'options',
    description: 'destination path to move genrated folder inside'
  }
];
