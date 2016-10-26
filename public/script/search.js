$('#dropdown-list a').click(function() {
    var option = $('#search-option');
    option.text(' ' + $(this).text());
    option.attr('option', this.id);
});
