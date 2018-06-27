var config = {
    apiKey: "AIzaSyCIG7kKZdLAzh8veOR6C-THKEPXp0pVWVQ",
    authDomain: "trainschedule-2281d.firebaseapp.com",
    databaseURL: "https://trainschedule-2281d.firebaseio.com",
    projectId: "trainschedule-2281d",
    storageBucket: "trainschedule-2281d.appspot.com",
    messagingSenderId: "291817846827"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  function calculateTrainData(freq, start){
        const now = moment().format('X');
        let startTime = moment(start, 'HH:mm').format('X');
        const frequency = freq * 60;
        let secRemaining = Math.abs(now - startTime) % frequency;
        let nextTrain = parseInt(now) + secRemaining;
        return {
            next: moment(nextTrain, 'X').format('HH:mm'),
            remaining: Math.round(secRemaining / 60)
        }
  }
  function loadTableItem(data){
      
      const calculated = calculateTrainData(data.freq, data.startTime);
      const tableArea = $('#schedgeTable');
      const nameRow = $('<td>').text(data.name);
      const destinationRow = $('<td>').text(data.dest);
      const frequencyRow = $('<td>').text(data.freq);
      const nextArrivalRow = $('<td>').text(calculated.next);
      const remainingRow = $('<td>').text(calculated.remaining);
      const newRow = $('<tr>').append(nameRow, destinationRow, frequencyRow, nextArrivalRow, remainingRow);
      tableArea.append(newRow);
  }

  $('document').ready(function(){
      $('#submitBtn').on('click', function(event){
            event.preventDefault();
            const name = $('#trainName').val().trim();
            const dest = $('#destination').val().trim();
            const startTime = $('#firstTime').val().trim();
            const freq = $('#frequency').val().trim();
            if(name && dest && startTime && freq){
                const newTrain = {
                   name,
                   dest,
                   startTime,
                   freq  
              }
              database.ref().push(newTrain);

              $('#frequency').val('');
              $('#firstTime').val('');
              $('#destination').val('');
              $('#trainName').val('');
            }
          
      })
      database.ref().on('child_added', snapshot => loadTableItem(snapshot.val()))
  })