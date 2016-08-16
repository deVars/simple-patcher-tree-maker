export default app => {
  require('./main')(app);
  require('./tree_container')(app);
  require('./tree_entry')(app);
}
