#hbswebapp

it is forked from [yeomap/generator-webapp](https://github.com/yeoman/generator-webapp) which is a fastest generator to generate a website.

* [hbs plugin](https://github.com/SlexAxton/require-handlebars-plugin)
* [backbone](https://github.com/documentcloud/backbone)
* [underscore](https://github.com/documentcloud/underscore)
* [require text plugin](https://github.com/requirejs/text)

# Usage

    git clone git@github.com:blackbing/generator-hbswebapp.git
    npm link
    cd {Your Project}
    yo hbswebapp

# Web app generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-webapp.png?branch=master)](http://travis-ci.org/yeoman/generator-webapp)

Yeoman generator for scaffolding out a front-end web app.


## Getting Started

- Make sure you have [yo](https://github.com/yeoman/yo) installed: `npm install -g yo`
- Install the generator: `npm install -g generator-webapp`
- Run: `yo webapp`
- Run `grunt` for building and `grunt server` for preview


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
  scaffolding has finished.

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched for
  another supported testing framework like `jasmine`.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
