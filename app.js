async function getSoda()
{
    try
    {
        const soda = await fetch('https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a')
        if(soda.ok)
        {
            const data = await soda.json() 
            const names = data.record.bebidas   //lista das bebidas

            const container = document.getElementById('printer')

            for(let name of names)  //p cada bebida, insere ela como botao no html
            {
                container.innerHTML += `
                                        <div class="soda-item d-flex align-items-center mb-3">
                                        <button class="soda-button" price="${name.preco}" onclick="selectSoda(this)"></button>
                                        <span class="ms-2">${name.sabor}</span>
                                        </div>
                                        `
            }
        }
    }
    catch(erro){
        console.error(erro)
    }

}

function selectSoda(btn)
{
    const buttons = document.querySelectorAll('.soda-button')   //seleciona todos os botoes

    for (let button of buttons) {
        button.classList.remove('selecionado')  //apaga todos, para que so um possa ser selecionado por vez sempre
    }
    
    btn.classList.add('selecionado')    //onclick, acende ele

    price = parseFloat(btn.getAttribute('price'))   //recebe atributo passado pelo html na funcao acima e transforma em float, 
                                                    //eh o preco passado pra ca, pra ser imprimido na tela
    const pricearea = document.getElementById('pricearea')
    pricearea.innerHTML= `<h3>${price.toFixed(2)}</h3>`
}

document.addEventListener('DOMContentLoaded', getSoda)  //espera carregar todo o html para chamar a funcao que imprime os botoes

const coins = document.getElementsByClassName('moeda')  //declaracoes
const machine = document.getElementById('machine')
const visor = document.getElementById('visor')
const buyButton = document.getElementById('buy')
let price = 0.00

const dropzones = [machine, visor]  //lista com as dropzones aceitas do drag n drop de cada moeda

let saldo = 0.00    //saldo inicial, antes de drag n drop de moedas

for(let coin of coins)  //percorre cada moeda, ao comecar o drag, pega o valor dela marcado no html
{
    coin.addEventListener('dragstart', function(event)
    {
        const valor = coin.getAttribute('valor')
        event.dataTransfer.setData('text/plain', valor)
    })
}

dropzones.forEach(function(zone)    //pra cada dropzone, da um prevent default, e no caso de drop, add o valor dropado ao saldo e atualiza o visor
{
    zone.addEventListener('dragover', (event) => event.preventDefault())
    
    zone.addEventListener('drop', function(event)
    {
        event.preventDefault()
        const income = event.dataTransfer.getData('text/plain');
        saldo += parseFloat(income)
    
        visor.innerText = saldo.toFixed(2)
    })
})

buyButton.addEventListener('click', function()  //ao clicar no botao de compra, verifica se a compra eh possivel, e imprime msgs adequadas
{
    const msg = document.getElementById('msg')
    if(price===0)
        {
            msg.innerHTML="<p>Please select a drink!</p>"  
            return 
        }
    if(price > saldo)
    {
        msg.innerHTML="<p>You have not inserted enough coins to buy this item</p>"
    }

    else if (price <= saldo)
    {
        saldo-=price    //se for possivel comprar, subtrai o preco do saldo, da o troco, e zera o saldo e o visor
        visor.innerText = '0.00'
        if(saldo > 0)
        {
            msg.innerHTML=`<p>Thank you for your purchase! Your change is $${saldo.toFixed(2)}</p>`
            saldo = 0
        }
        else 
        {
            msg.innerHTML="<p>Thank you for your purchase!</p>"
            saldo = 0
        }
    }
})