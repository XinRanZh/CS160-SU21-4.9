window.onload = (event) => {
  // simulate userDB; initialize users and randomly assign each user a name
  var uid = Math.floor(Math.random() * 10);
  var usernames = ["Emily", "John", "Ben", "Nia", "Stephanie", "Aisha", "Alan", "Chris", "Nisha", "Akira"]
  var listDataBase = {}
  var validater = {}

  var url = window.location.href;
  var socket = new WebSocket('ws://' + window.location.host + '/ws/draw');


  // fix viewport to address keyboard resizing html issue
  // source: stackoverflow @Tyler Merle
  setTimeout(function() {
    let viewheight = $(window).height();
    let viewwidth = $(window).width();
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + ", width=" + viewwidth + ", initial-scale=1.0");
  }, 300);

  // set initial date
  let today = new Date();
  let month = today.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  $('#Date, #Date2').val(today.getFullYear() + "-" + month + "-" + today.getDate());

  $("#Name, #Name2").focus(function() {
    $(this).val("");
    $(this).css("color", "black")
  })

  $("#Name, #Name2").focusout(function() {
    if ($(this).val() == "") {
      $(this).val("Enter task...")
      $(this).css("color", "rgb(104, 104, 104)")
    }
  })

  $("#Name2").focus(function() {
    $(".btnDiv").css("visibility", "hidden");
  })

  $("#Name2").focusout(function() {
    $(".btnDiv").css("visibility", "visible");
  })

  $("#Add").click(function() {
    var name = $("#Name, #Name2").val()
    var date = $("#Date, #Date2").val()
    var task = $("#Task, #Task2").val()

    if (name && date && (validater[name] == undefined || (validater[name][0] !== date && validater[name][1] !== task))) {

      var tDiv = $(('<div>')).addClass("taskBar");
      tDiv.append(
        $(('<div>')).html(`<label for="${name}" id="taskName">${name}</label><label for="${date}">Deadline: ${date}</label>`).addClass("taskItem"),
        $(('<div>')).html(`<input type="checkbox" value="${name};${date};${task}">`).addClass("taskCheck")
      )
      tDiv.addClass("animate__animated animate__fadeIn animate__fast")
      $('#taskDiv, #taskDiv2').append(tDiv);
      validater[name] = [date, task]
    } else {
      alert("You got duplicated task OR empty name/date")
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
  }

  socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
  };
};