$(function() {
    updateTableLinks();

    $('#confirm-delete').on('show.bs.modal', function(e) {
	    $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
	});
});

/* 
    Updates some of the <td> in the table to be a clickable link through to details, 
    all apart from the last cell with with the drop down menu. Uses the RepeatUtil directive
*/
function updateTableLinks(){
    $('.table td.row-link').each(function () {
        $(this).css('cursor', 'pointer').hover(
            function () {
                $(this).parent().addClass('active');
            },
            function () {
                $(this).parent().removeClass('active');
            }).click(function () {
                document.location = $(this).parent().attr('data-href');
            }
        );
    });
}