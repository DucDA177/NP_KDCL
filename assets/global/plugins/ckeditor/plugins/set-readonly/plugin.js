CKEDITOR.plugins.add('set-readonly', {
    init: function (editor) {
        editor.on('contentDom', function () {
            var editable = editor.editable();
            editable.attachListener(editable, 'click', function (evt) {
                var link = new CKEDITOR.dom.elementPath(evt.data.getTarget(), this).contains('a');
                if (link && evt.data.$.button != 2 && link.isReadOnly()) {
                    let id = link.getAttribute('id');
                    console.log(id)
                    angular.element(document.body).scope().OpenViewMinhChung(id)
                    //window.open(link.getAttribute('href'));
                }
            }, null, null, 15);
        });

        editor.addCommand('set-readonly', {
            readOnly: 1,
            exec: function (editor) {
                editor.setReadOnly(!editor.readOnly);
            }
        });
        editor.ui.addButton('SetReadOnly', {
            label: 'Xem trước',
            title:'Xem trước',
            command: 'set-readonly',
            toolbar: 'insert',
            icon: this.path + 'icons/set-readonly.png',
        });
    }
});