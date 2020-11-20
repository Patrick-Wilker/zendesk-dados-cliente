let client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '320px' });

client.get('ticket.requester.id').then(
  function(data) {
    let user_id = data['ticket.requester.id'];
    requestUserInfo(client, user_id);
  }
);

// console.log("Origin", client._origin);
// console.log("App Guid", client._appGuid);

let user, i, aberto=0, novo=0, pending=0, hold=0, solved=0, closed=0, loadingStatus=true;

function showInfo(data, novo, aberto, pending, hold, solved, closed, loadingStatus) {
    if(!data.user.photo){
      data.user.photo = ''
    }
    let requester_data = {
        'name': data.user.name,
        'email': data.user.email,
        'phone': data.user.phone,
        'photo': data.user.photo.content_url,
        'tags': data.user.tags,
        'nivel': data.user.user_fields.expertise,
        'cpf': data.user.user_fields.cpf,
        'novo': novo,
        'open': aberto,
        'pending': pending,
        'hold': hold,
        'solved': solved,
        'closed':closed,
        'loadingStatus': loadingStatus
    };
  
    let source = $("#requester-template").html();
    let template = Handlebars.compile(source);
    let html = template(requester_data);
    $("#content").html(html);
}

async function requestUserInfo(client, id) {

  let settings = {
    url: '/api/v2/users/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  await client.request(settings).then(                        
    function(data) {
      // console.log(data)
      user = data
      showInfo(user, novo, aberto, pending, hold, solved, closed, loadingStatus);
    },
  );

  await client.request('/api/v2/users/' + id + '/tickets/requested.json').then(
    function(tickets) {
      // console.log(tickets)
      countStatus(tickets)

      if(tickets.next_page){
        moreTickets(tickets.next_page);
      }else{
        loadingStatus = false;
        showInfo(user, novo, aberto, pending, hold, solved, closed, loadingStatus);
      }
    }
  );  
}

async function moreTickets(url){
  await client.request(url).then(
    function(tickets){
      // console.log("Segundo Ticket")
      // console.log(tickets)
      countStatus(tickets)

      if(tickets.next_page){
        moreTickets(tickets.next_page);
      }else{
        loadingStatus = false;
        showInfo(user, novo, aberto, pending, hold, solved, closed, loadingStatus);
      }
    }
  );
}

function countStatus(tickets){
  tickets.tickets.map( ticket =>{
    if(ticket.status == 'open'){
      aberto++;
    }
    else if(ticket.status == 'new'){
      novo++;
    }
    else if(ticket.status == 'pending'){
      pending++;
    }
    else if(ticket.status == 'hold'){
      hold++;
    }
    else if(ticket.status == 'solved'){
      solved++;
    }
    else if(ticket.status == 'closed'){
      closed++;
    }
  })
}
