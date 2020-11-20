let cpf, cpf_id, nivel, nivel_id;

function showField(cpf, cpf_id, nivel, nivel_id){
    let requester_data = {
        'nivel': nivel,
        'nivel_id': nivel_id,
        'cpf': cpf,
        'cpf_id': cpf_id
    };
  
    let source = $("#custom").html();
    let template = Handlebars.compile(source);
    let html = template(requester_data);
    $("#configuration").html(html);
}

async function custom(){
    await client.request('/api/v2/user_fields.json').then(
        function(data) {
            data.user_fields.map(field => {
                if(field.key == 'cpf'){
                    cpf = field.active
                    cpf_id = field.id
                }else if(field.key == 'expertise'){
                    nivel = field.active
                    nivel_id = field.id
                }
            })

            showField(cpf, cpf_id, nivel, nivel_id)
        }
    );  
}

custom()

async function disableField(id, active){
    await client.request({
        url: '/api/v2/user_fields/'+ id +'.json',
        method: 'PUT',
        data: {
            user_field: {
                active: active
            }
        }
    }).then(
        function(data) {
            //console.log(data)
        }
    ); 
}


// async function disableTag(active){
//     await client.request('/api/v2/user_fields.json').then(
//         function(data){
//             data.user_fields.map(field => {
//                 if(field.tag){
//                     disableField(field.id, active)
//                     console.log(field)
//                     tags = false
//                 }
//             })
//         }
//     );
//}