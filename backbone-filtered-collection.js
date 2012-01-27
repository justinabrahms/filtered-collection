/*
Copyright (C) 2012 Dmitriy Likhten

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function(Backbone) {
  var defaultFilter = function() {return true;};
  /**
   * This represents a filtered collection. You can either pass a filter or
   * invoke setFilter(filter) to give a filter. The filter is identical to
   * that which is used for _.select(array, filter)
   *
   * false filter indicates no filtering.
   *
   * do not modify this collection directly via #add/#remove, modify the
   * underlying origModel.
   */
  Backbone.FilteredCollection = Backbone.Collection.extend({
    defaultFilter: defaultFilter,
    filter: null,
    origModel: null,
    model: null,

    initialize: function(data) {
      this.origModel = data.origModel;

      var origModel = this.origModel;
      // has to be done like this to properly handle insertions in middle...
      origModel.bind("add", this.resetOrigModel, this);

      // this can be optimized
      origModel.bind("remove", this.removeModel, this);

      origModel.bind("reset", this.resetOrigModel, this);
      this.setFilter(data.filter);
    },

    resetOrigModel: function() {
      this.setFilter();
    },

    removeModel: function(removed) {
      this.remove(removed);
    },

    setFilter: function(newFilter) {
      if (newFilter === false) { newFilter = defaultFilter } // false = clear out filter
      this.filter = newFilter || this.filter || this.defaultFilter;
      console.log(this.filter);
      var filtered = this.origModel.filter(this.filter, this);
      this.reset(filtered);
    }
  });
})(Backbone);