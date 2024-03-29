const Modal = {

        open (){
            // Abrir modal
            // Adicionar a class active ao modal
            document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

            console.log('OK')
        },
        close(){
            // Fechar modal
            // remover a class active ao modal
            document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
        }
    }
    

const Storage = {
     get () {
         return JSON.parse(localStorage.getItem("dev.finance:transactions")) || []
        },
    set (transaction) {
         localStorage.setItem("dev.finance:transactions",
         JSON.stringify(transaction))
        }
    }

const Transaction = {
        all: Storage.get(),
        
        add (transaction){
            Transaction.all.push(transaction)

            App.reload()
        },

        remove(index) {
            Transaction.all.splice(index, 1)

            App.reload()
        },
        
        incomes (){
            
            let income = 0;

            // // pegar todas as transações
            Transaction.all.forEach(function(transaction){
             // para cada transação, se ela for maior que zero
             if( transaction.amount > 0 ) {
            // somar a uma variavel e retornar a variavel
            income += transaction.amount;
             }
            })
            return income;
            console.log(transactions)
        },

        expenses () {
            let expense = 0;
            // pegar todas as transações
            Transaction.all.forEach(function(transaction) {
             // para cada transação, se ela for menor que zero
             if(transaction.amount < 0) {
            // somar a uma variavel e retornar a variavel
            expense += transaction.amount }
            })
            return expense;
        },

        total () {
            return Transaction.incomes() + Transaction.expenses();
    } }

    // eu preciso substituir os dados do html com os dados do js

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index


        DOM.transactionsContainer.appendChild(tr)
    },
    
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" 
                alt="Remover Transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())
        
        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g,"")) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
     const signal = Number(value) < 0 ? "-" : ""

     value = String(value).replace(/\D/g, "")

     value = Number(value) / 100

     value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
     })

     return signal + value

    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getValues()

        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error('Por favor preencha todos os campos')
            }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        console.log(description, amount, date)

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount, 
            date
        }
    },
    
    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
        Form.validateFields()
        // formatar os dados para salvar
        const transaction = Form.formatValues()

        console.log(transaction)

        // salvar
        Form.saveTransaction(transaction)
        //apagar os dados do form
        Form.clearFields()
        // modal feche
        Modal.close()
        } catch (Error) {
            alert(Error.message)
        }
     
    },
}

const App = {
    init () {

        Transaction.all.forEach(function(transaction, index) {
            DOM.addTransaction(transaction, index)
        })
            
        DOM.updateBalance()

        Storage.set(Transaction.all)
        
    },
    reload (){
        DOM.clearTransactions()
        App.init()
    },
    }

App.init ()



