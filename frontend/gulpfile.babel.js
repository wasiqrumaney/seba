import gulp from 'gulp';
import less from 'gulp-less';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';
import es from 'event-stream';
import htmlmin from 'gulp-html-minifier';
import uglify from 'gulp-uglify';
import csso from 'gulp-csso';
import webpack from 'webpack';
import path from 'path';
import WebpackNotifierPlugin from 'webpack-notifier';
import livereload from 'gulp-livereload';
import connect from 'gulp-connect';

gulp.task('connect', () => {
  connect.server({
    root: './assets/dist',
    port: 80,
    livereload: true,
  });
});
// webpack normal mode config
const config = {
  color: true,
  progress: true,
  watch: true,
  devtool: 'source-map',
  debug: true,
  entry: {
    'scripts.js': './assets/src/js/scripts.js',
  },
  output: {
    path: './assets/dist/js/',
    filename: '[name]',
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    alias: {
      'masonry': 'masonry-layout',
      'isotope': 'isotope-layout'
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
      {
        test: /isotope\-|fizzy\-ui\-utils|desandro\-|masonry|outlayer|get\-size|doc\-ready|eventie|eventemitter|classie|get\-style\-property|packery/,
        loader: 'imports?define=>false&this=>window'
      },
      {
        test: /imagesloaded|ev\-emitter/,
        loader: 'imports?define=>false&this=>window'
      }
    ],
  },
  plugins: [
    new WebpackNotifierPlugin({ title: 'Webpack', sound: 'Glass' }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery',
    }),
  ],
  exclude: [
    path.resolve(__dirname, 'node_modules'),
  ],
};
// gulp webpack task
gulp.task('webpack', () => {
  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
    }));
  });
});
// webpack production task
gulp.task('js-minify', () => {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new WebpackNotifierPlugin({ title: 'Webpack' }),
  ];
  config.watch = false;
  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
    }));
  });
});

gulp.task('html', () => {
  gulp.src('./assets/dist/**/*.html')
  .pipe(livereload());
});
// Error handler for less

const errorAlert = (error) => {
  notify.onError({ title: 'Gulp Compiled Error', message: 'Check your terminal', sound: 'Sosumi' })(error);
  this.emit('end');
};

// gulp less task
gulp.task('less-business', () => {
  return gulp.src('./assets/src/less/business/business.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less business',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/business/css/'))
  .pipe(livereload());
});

gulp.task('less-jobs', () => {
  return gulp.src('./assets/src/less/jobs/jobs.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less jobs',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/jobs/css/'))
  .pipe(livereload());
});

gulp.task('less-marketplace', () => {
  return gulp.src('./assets/src/less/marketplace/marketplace.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less marketplace',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/marketplace/css/'))
  .pipe(livereload());
});

gulp.task('less-real-estate', () => {
  return gulp.src('./assets/src/less/real-estate/real-estate.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less real-estate',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/real-estate/css/'))
  .pipe(livereload());
});

gulp.task('less-restaurant', () => {
  return gulp.src('./assets/src/less/restaurant/restaurant.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less restaurant',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/restaurant/css/'))
  .pipe(livereload());
});

gulp.task('less-blog', () => {
  return gulp.src('./assets/src/less/blog/blog.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less blog',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/blog/css/'))
  .pipe(livereload());
});

gulp.task('less-pages', () => {
  return gulp.src('./assets/src/less/pages/pages.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less Pages',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/pages/css/'))
  .pipe(livereload());
});

gulp.task('less-landing-pages', () => {
  return gulp.src('./assets/src/less/landing-pages/landing-pages.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less landing Pages',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/landing-pages/css/'))
  .pipe(livereload());
});

gulp.task('less-base', () => {
  return gulp.src('./assets/src/less/base.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Base less Successfully Compiled',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/css/'))
  .pipe(livereload());
});

gulp.task('less-plugins', () => {
  return gulp.src('./assets/src/less/plugins-stylesheet.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Plugins Less Successfully Compiled',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/css/'))
  .pipe(livereload());
});

gulp.task('less-elements', () => {
  return gulp.src('./assets/src/less/element-page/elements.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Elements Less Successfully Compiled',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/elements/css/'))
  .pipe(livereload());
});

gulp.task('less-common-task', () => {
  return gulp.src('./assets/src/less/common.style.less')
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less common task',
    sound: 'Pop',
  }))
  .pipe(livereload());
});


// Minify Business CSS
gulp.task('minify-business-less', () => {
  return gulp.src([
    './assets/src/less/business/business.style.less',
  ])
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
  }))
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Business css Minification Done',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/business/css/'))
  .pipe(livereload());
});

// Minify Job CSS
gulp.task('minify-job-less', () => {
  return gulp.src([
    './assets/src/less/jobs/jobs.style.less',
  ])
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
  }))
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Job css Minification Done',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/jobs/css/'))
  .pipe(livereload());
});


// Minify Real Estate CSS
gulp.task('minify-realestate-less', () => {
  return gulp.src([
    './assets/src/less/real-estate/real-estate.style.less'
  ])
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
  }))
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Real Estate css Minification Done',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/real-estate/css/'))
  .pipe(livereload());
});


// Minify Elements CSS
gulp.task('minify-element-less', () => {
  return gulp.src([
    './assets/src/less/element-page/elements.style.less',
  ])
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
  }))
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Element css Minification Done',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/element-page/css/'))
  .pipe(livereload());
});

// Minify Landing CSS
gulp.task('minify-landing-page-less', () => {
  return gulp.src([
    './assets/src/less/landing-pages/landing-pages.style.less',
  ])
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
  }))
  .pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'Landing Page css Minification Done',
    sound: 'Pop',
  }))
  .pipe(gulp.dest('./assets/dist/landing-pages/css/'))
  .pipe(livereload());
});

gulp.task('minify-css', [
  'minify-business-less',
  'minify-job-less',
  'minify-realestate-less',
  'minify-element-less',
  'minify-landing-page-less',
]);

// Minify js
gulp.task('minify-js', () => {
  return gulp.src([
    './assets/dist/js/scripts.js',
    // './assets/dist/js/business-map/google-contactmap-init.js',
    // './assets/dist/js/business-map/google-searchmap-init.js',
    // './assets/dist/js/job-map/google-contactmap-init.js',
    // './assets/dist/js/job-map/google-searchmap-init.js',
    // './assets/dist/js/realestate-map/google-contactmap-init.js',
    // './assets/dist/js/realestate-map/google-searchmap-init.js',
    './assets/dist/js/google-autocomplete.js',
    './assets/dist/js/google-map-init.js',
    './assets/dist/js/infobubble-richmarker.js',
    './assets/dist/js/main.js',
    './assets/dist/js/plugins.js'
  ])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(uglify())
    .pipe(notify({
      title: 'Gulp',
      subtitle: 'success',
      message: 'js Minify Complete',
      sound: 'Pop',
    }))
    .pipe(gulp.dest('./assets/dist/production/js/'));
});

gulp.task('minify-html', function() {
  gulp.src('./assets/dist/*/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./assets/dist/production/html/'))
});

// watch task
gulp.task('watch', () => {
  livereload.listen();
  // gulp.watch('./assets/src/less/**/*.less', ['less-common-task', 'less-business','less-elements', 'less-jobs', 'less-real-estate', 'less-restaurant', 'less-landing-pages']);
  gulp.watch('./assets/src/less/**/*.less', ['less-common-task', 'less-restaurant']);
  gulp.watch('./assets/dist/**/*.html', ['html']);
});
// webpack production task
gulp.task('production', [
  'js-minify',
  'minify-js',
  'minify-html',
  'minify-css'
]);
// default task
// gulp.task('default', ['watch', 'less-common-task','less-elements', 'less-business', 'less-jobs', 'less-real-estate','less-restaurant','less-landing-pages', 'webpack', 'html']);
gulp.task('default', ['watch', 'less-common-task', 'less-restaurant', 'webpack', 'html']);

