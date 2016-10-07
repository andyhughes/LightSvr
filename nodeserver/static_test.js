module.exports = {
  static : [{
  "name" : "static test",
  "subdocs" : {
    "item1" : "ab1c",
    "item2" : "abc",
  },
  "array" : ["one", "two", "three"]}],
  db_read : [ {"owner": "testUser", "title": "Test element 1", "description": { "text": "Short description", "modified": "12-May-2014" }, "attr": [ "attr 1", "attr 2", "attr 3" ] }, {"owner": "testUser", "title": "Test element 2", "description": { "text": "Short bio", "modified": "21-Aug-2015" }, "attr": [ "attr a", "attr b", "attr c" ] } ]
};
