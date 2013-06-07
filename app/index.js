'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.mainJsFile = '';
  this.mainCoffeeFile = 'console.log "\'Allo from CoffeeScript!"';

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |'+'--(o)--'.red+'|   .--------------------------.' +
  '\n   `---------´  |    '+'Welcome to Yeoman,'.yellow.bold+'    |' +
  '\n    '+'( '.yellow+'_'+'´U`'.yellow+'_'+' )'.yellow+'   |   '+'ladies and gentlemen!'.yellow.bold+'  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __'+'\'.___.\''.yellow+'__' +
  '\n ´   '+'`  |'.red+'° '+'´ Y'.red+' `\n';

  console.log(welcome);
  console.log('Out of the box I include HTML5 Boilerplate, jQuery and Modernizr.');

  var prompts = [{
    name: 'compassBootstrap',
    message: 'Would you like to include Twitter Bootstrap for Sass?',
    default: true,
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  },
  {
    name: 'includeRequireJS',
    message: 'Would you like to include RequireJS (for AMD support)?',
    default: true,
    warning: 'Yes: RequireJS will be placed into the JavaScript vendor directory.'
  },
  {
    name: 'includeHBS',
    message: 'Would you like to include HBS (Handlebars for requireJS plugin)?',
    default: true,
    warning: 'Yes: use hbs!template/blabla to use as Handlebar template.'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.compassBootstrap = props.compassBootstrap;
    this.includeRequireJS = props.includeRequireJS;
    this.includeHBS= props.includeHBS;

    cb();
  }.bind(this));
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');
};

AppGenerator.prototype.bootstrapImg = function bootstrapImg() {
  if (this.compassBootstrap) {
    this.copy('glyphicons-halflings.png', 'app/images/glyphicons-halflings.png');
    this.copy('glyphicons-halflings-white.png', 'app/images/glyphicons-halflings-white.png');
  }
};

AppGenerator.prototype.bootstrapJs = function bootstrapJs() {
  // TODO: create a Bower component for this
  if (this.compassBootstrap) {
    this.copy('bootstrap.js', 'app/scripts/vendor/bootstrap.js');
  }
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  if (this.compassBootstrap) {
    this.write('app/styles/main.scss', '$iconSpritePath: "../images/glyphicons-halflings.png";\n$iconWhiteSpritePath: "../images/glyphicons-halflings-white.png";\n\n@import \'sass-bootstrap/lib/bootstrap\';\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}');
  } else {
    this.write('app/styles/main.css', 'body {\n    background: #fafafa;\n}\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}');
  }
};

AppGenerator.prototype.writeIndex = function writeIndex() {
  // prepare default content text
  var defaults = ['HTML5 Boilerplate'];
  var contentText = [
    '        <div class="container">',
    '            <div class="hero-unit">',
    '                <h1>\'Allo, \'Allo!</h1>',
    '                <p>You now have</p>',
    '                <ul>'
  ];

  if (!this.includeRequireJS) {
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', [
      'bower_components/jquery/jquery.js',
      'scripts/main.js'
    ]);

    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizedPath: 'scripts/coffee.js',
      sourceFileList: ['scripts/hello.js'],
      searchPath: '.tmp'
    });
  }

  if (this.compassBootstrap) {
    defaults.push('Twitter Bootstrap');
  }

  if (this.compassBootstrap && !this.includeRequireJS) {
    // wire Twitter Bootstrap plugins
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      'bower_components/sass-bootstrap/js/bootstrap-affix.js',
      'bower_components/sass-bootstrap/js/bootstrap-alert.js',
      'bower_components/sass-bootstrap/js/bootstrap-dropdown.js',
      'bower_components/sass-bootstrap/js/bootstrap-tooltip.js',
      'bower_components/sass-bootstrap/js/bootstrap-modal.js',
      'bower_components/sass-bootstrap/js/bootstrap-transition.js',
      'bower_components/sass-bootstrap/js/bootstrap-button.js',
      'bower_components/sass-bootstrap/js/bootstrap-popover.js',
      'bower_components/sass-bootstrap/js/bootstrap-typeahead.js',
      'bower_components/sass-bootstrap/js/bootstrap-carousel.js',
      'bower_components/sass-bootstrap/js/bootstrap-scrollspy.js',
      'bower_components/sass-bootstrap/js/bootstrap-collapse.js',
      'bower_components/sass-bootstrap/js/bootstrap-tab.js'
    ]);
  }

  if (this.includeRequireJS) {
    defaults.push('RequireJS');
  } else {
    this.mainJsFile = 'console.log(\'\\\'Allo \\\'Allo!\');';
  }

  if (this.includeHBS) {
    defaults.push('hbs (require-handlebars-plugin)');
  }
  // iterate over defaults and create content string
  defaults.forEach(function (el) {
    contentText.push('                    <li>' + el  +'</li>');
  });

  contentText = contentText.concat([
    '                </ul>',
    '                <p>installed.</p>',
    '                <h3>Enjoy coding! - Yeoman</h3>',
    '            </div>',
    '        </div>',
    ''
  ]);

  // append the default content
  if( this.includeHBS)
    this.write('app/scripts/templates/app.hbs', contentText.join('\n'));
  else
    this.indexFile = this.indexFile.replace('<body>', '<body>\n' + contentText.join('\n'));

};

// TODO(mklabs): to be put in a subgenerator like rjs:app
AppGenerator.prototype.requirejs = function requirejs() {
  if (this.includeRequireJS) {
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', ['bower_components/requirejs/require.js'], {
      'data-main': 'scripts/main'
    });

    // add a basic amd module
    this.write('app/scripts/app.coffee', [
      '#global define',
      'define (require)->',
      '    \'use strict\'\n',
      (this.includeHBS)?'    tpl = require \'hbs!templates/app\'':'',
      (this.includeHBS)?'    $(\'body\').append(tpl())':'',
      '    return \'\\\'Allo \\\'Allo!\'',
      ''
    ].join('\n'));

    this.mainJsFile = [
      'require.config',
      '    paths:',
      (this.includeHBS)? '        hbs: \'../bower_components/hbs/hbs\'': '',
      (this.includeHBS)?'        handlebars: \'../bower_components/hbs/Handlebars\'': '',
      (this.includeHBS)?'        i18nprecompile: \'../bower_components/hbs/hbs/i18nprecompile\'': '',
      (this.includeHBS)?'        json2: \'../bower_components/hbs/hbs/json2\'': '',
      '        jquery: \'../bower_components/jquery/jquery\'',
      '        bootstrap: \'vendor/bootstrap\'',
      '        backbone: \'../bower_components/backbone-amd/backbone\'',
      '        underscore: \'../bower_components/underscore-amd/underscore\'',
      '        text: \'../bower_components/requirejs-text/text\'',
      '    ',
      (this.includeHBS)?'    hbs:':'',
      (this.includeHBS)?'        disableI18n: true #This disables the i18n helper and':'',
      (this.includeHBS)?'                           #doesn\'t require the json i18n files (e.g. en_us.json)':'',
      (this.includeHBS)?'                           #(false by default)':'',
      (this.includeHBS)?'        disableHelpers: false # When true, won\'t look for and try to automatically load':'',
      (this.includeHBS)?'                               # helpers (false by default)':'',
      (this.includeHBS)?'        templateExtension: \'hbs\' #Set the extension automatically appended to templates':'',
      (this.includeHBS)?'                                  # (\'hbs\' by default)':'',
      (this.includeHBS)?'        compileOptions: {} #options object which is passed to Handlebars compiler':'',
      '    shim:',
      '        bootstrap:',
      '            deps: [\'jquery\']',
      '            exports: \'jquery\'',
      '        ',
      '    ',
      '',
      '',
      'require([\'app\', \'jquery\', \'bootstrap\'], (app, $)->',
      '    \'use strict\'',
      '    # use app here',
      '    console.log(app)',
      '    console.log(\'Running jQuery %s\', $().jquery)',
      ')'
    ].join('\n');
  }
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/index.html', this.indexFile);
  this.write('app/scripts/main.coffee', this.mainJsFile);
  this.write('app/scripts/hello.coffee', this.mainCoffeeFile);
};
