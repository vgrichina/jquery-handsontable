describe('NumericEditor', function () {
  var id = 'testContainer';

  beforeEach(function () {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  var arrayOfObjects = function () {
    return [
      {id: 1, name: "Ted", lastName: "Right"},
      {id: 2, name: "Frank", lastName: "Honest"},
      {id: 3, name: "Joan", lastName: "Well"},
      {id: 4, name: "Sid", lastName: "Strong"},
      {id: 5, name: "Jane", lastName: "Neat"},
      {id: 6, name: "Chuck", lastName: "Jackson"},
      {id: 7, name: "Meg", lastName: "Jansen"},
      {id: 8, name: "Rob", lastName: "Norris"},
      {id: 9, name: "Sean", lastName: "O'Hara"},
      {id: 10, name: "Eve", lastName: "Branson"}
    ];
  };

  it('should convert numeric value to number (object data source)', function () {
    handsontable({
      data: arrayOfObjects(),
      columns: [
        {data: 'id', type: 'numeric'},
        {data: 'name'},
        {data: 'lastName'}
      ]
    });
    selectCell(2, 0);

    keyDown('enter');
    document.activeElement.value = '999';

    destroyEditor();
    expect(getDataAtCell(2, 0)).toEqual(999); //should be number type
  });

  it('should display numbers with decimal point correctly', function () {
    handsontable({
      data: [
        {price: 6999.99}
      ],
      columns: [
        {
          data: 'price',
          type: 'numeric',
          format: '$0,0.00',
          language: 'en'
        },
        {
          data: 'price',
          type: 'numeric',
          format: '0,0.00 $',
          language: 'de-de'
        }
      ]
    });

    expect(this.$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('$6,999.99');
    expect(this.$container.find('tbody tr:eq(0) td:eq(1)').html()).toEqual('6.999,99 €');

    selectCell(0,0);

    keyDown('enter');

    var editor = this.$container.find('.handsontableInput');
    expect(editor.val()).toEqual('6999.99');

    keyDown('enter');

    expect(this.$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('$6,999.99');
    expect(this.$container.find('tbody tr:eq(0) td:eq(1)').html()).toEqual('6.999,99 €');

  });
});