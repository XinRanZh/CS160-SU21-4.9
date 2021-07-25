  // simulate userDB; initialize users and randomly assign each user a name
  var uid = Math.floor(Math.random() * 5);
  var usernames = ["Emily", "John", "Ben", "Nia", "Stephanie", "Aisha"]
  var listDataBase = {}

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

  $("#Name2").focus(function() {
    $(this).val("");
    $(this).css("color", "black")
  })

  $("#Name2").focusout(function() {
    if ($(this).val() == "") {
      $(this).val("Enter task...")
      $(this).css("color", "rgb(104, 104, 104)")
    }
  })

  $("#Add").click(function() {
    var name = $("#Name").val()
    var date = $("#Date").val()
    var task = $("#Task").val()

    if (name && date) {
      var tDiv = $(('<div>')).addClass("taskBar");
      tDiv.append(
        $(('<div>')).html(`<label for="${name}" id="taskName">${name}</label><label for="${date}">Deadline: ${date}</label>`).addClass("taskItem"),
        $(('<div>')).html(`<input type="checkbox" value="${name};${date};${task}">`).addClass("taskCheck")
      )
      tDiv.addClass("animate__animated animate__fadeIn animate__fast")
      $('#taskDiv').append(tDiv);
    }
  })

  $("#Add2").click(function() {
    var name = $("#Name2").val()
    var date = $("#Date2").val()
    var task = $("#Task2").val()

    if (name && date) {
      var tDiv = $(('<div>')).addClass("taskBar");
      tDiv.append(
        $(('<div>')).html(`<label for="${name}" id="taskName">${name}</label><label for="${date}">Deadline: ${date}</label>`).addClass("taskItem"),
        $(('<div>')).html(`<input type="checkbox" value="${name};${date};${task}">`).addClass("taskCheck")
      )
      tDiv.addClass("animate__animated animate__fadeIn animate__fast")
      $('#taskDiv2').append(tDiv);
    }
  })

  $("#Remove").click(function() {
    var checkboxes = $(":checkbox")
    for (var i = 0; i < checkboxes.length; i++) {
      var item = checkboxes[i];
      if (item.checked) {
        item.parentNode.parentNode.parentNode.removeChild(item.parentNode.parentNode);
      }
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
        console.log(item.value)
        obj.name = item.value.split(";")[0]
        obj.date = item.value.split(";")[1]
        obj.kind = '#' + item.value.split(";")[2] + 'Tasks';
        selectedTasks.push(obj)
      }
    }
    var object = {}
    object.uid = uid;
    object.task = selectedTasks;
    socket.send(JSON.stringify(object))
  })

  socket.onmessage = function(receivedMessage) {
    var received = JSON.parse(receivedMessage.data);
    console.log(received)
    // bigScreen Data display
    uname = usernames[received.uid].toString();
    listDataBase[uname] = received.task;
    $('#testTasks').html("");
    $('#developTasks').html("");
    $('#designTasks').html("");
    $('#deployTasks').html("");
    $('#reviewTasks').html("");
    Object.keys(listDataBase).forEach(function(key) {
      listDataBase[key].forEach(task => {
        $(task.kind).append($(('<div>')).html(`${task.name}<br>Deadline:<br>${task.date}<br>Posted by:${usernames[task.uid]}`).addClass("bigScreenTasks animate__animated animate__fadeIn animate__fast"));
      })
    })
    // received.task.forEach(task => {  
    //   $('#testTasks').append($(('<div>')).html(`${task.name}<br>Deadline:<br>${task.date}<br>Posted by:${usernames[task.uid]}`).addClass("bigScreenTasks"));
    // })
  }

  socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
  };