export default app => {
  app.filter('byteify', function() {
    return function(input) {
      input = input || '';

      return input.replace(/(\S{1,2})/g, '$1 ');
    };
  });
};
