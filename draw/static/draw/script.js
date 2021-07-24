  console.log("script is loaded!")
  // simulate userDB; initialize users and randomly assign each user a name
  var uid = Date.now() % 10000;
  var usernames = ["Emily", "John", "Ben", "Nia", "Stephanie", "Aisha"]
  var users = {}; // { id: username }
  users[uid] = usernames[Math.floor(Math.random() * 5)];

  var url = window.location.href;
  var socket = new WebSocket('ws://' + window.location.host + '/ws/draw');


  // button interactions
  $("#Name").focus(function() {
    $(this).val("");
    $(this).css("color", "black")
  })

  $("#Name").focusout(function() {
    if ($(this).val() == "") {
      $(this).val("Enter task...")
      $(this).css("color", "rgb(104, 104, 104)")
    }
  })

  $("#Add").click(function() {
    var name = $("#Name").val()
    var date = $("#Date").val()

    if (name && date) {
      var tDiv = $(('<div>')).addClass("taskBar");
      tDiv.append(
        $(('<div>')).html(`<label for="${name}" id="taskName">${name}</label><label for="${date}">Deadline: ${date}</label>`).addClass("taskItem"),
        $(('<div>')).html(`<input type="checkbox" value="${name};${date}">`).addClass("taskCheck")
      )
      $('#taskDiv').append(tDiv);
    }
  })

  $("#Push").click(function() {
    var checkboxes = $(":checkbox")
    var selectedTasks = [];
    for (var i = 0; i < checkboxes.length; i++) {
      var item = checkboxes[i];
      if (item.checked) {
        var obj = {};
        obj.uid = uid;
        obj.name = item.value.split(";")[0]
        obj.date = item.value.split(";")[1]
        selectedTasks.push(obj)
      }
    }
    socket.send(JSON.stringify(selectedTasks))
  })

  socket.onmessage = function(receivedMessage) {
    var received = JSON.parse(receivedMessage.data);
    // console.log(received);

    // bigScreen Data display
    received.forEach(task => {
      $('#designTasks').append($(('<div>')).html(task.name).addClass("bigScreenTasks"));
    })
  }

  socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
  };