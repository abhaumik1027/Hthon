$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever')
    const myArray = recipient.split(",");
    var modal = $(this)
    //modal.find('.modal-title').text('New message to ' + recipient)
    console.log(modal)
    modal.find('.modal-body #fullUrl').val(myArray[0])
    modal.find('.modal-body #shortUrl').val(myArray[1])
  })