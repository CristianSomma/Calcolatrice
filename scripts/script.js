let displayedValue = '';

document.addEventListener('DOMContentLoaded', () => {
    // Valore già inserito
    updateDisplayedValue();
})

// Alla pressione di un tasto qualunque della tastiera
document.addEventListener('keydown', (keyEvent) => {
    // Tutti gli elementi non validi si trovano in questo array
    const invalidSymbols = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '"', '#', '$', '&', '£', '€',  '\'', ',', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'
    ];

    // Se il tasto premuto è nell'array dei caratteri invalidi non viene inserito
    if(invalidSymbols.includes(keyEvent.key)){
        keyEvent.preventDefault();
    }else{

    // Quando viene cliccato il tasto enter esegue l'operazione inserita
    // Quando premo '/' si usa keyEvent.preventDefault() per bloccare l'inserimento del simbolo della tastiera e viene sostituito con il simbolo deciso
    // Lo stesso vale per '*'
        switch (keyEvent.key) {
            case 'Enter':
                result();
                break;
            case 'Backspace':
                keyEvent.preventDefault();
                deleteLast();
                break;
            case '/':
                keyEvent.preventDefault();
                show(null, '÷');            
                break;
            case '*':
                keyEvent.preventDefault();
                show(null, '×');            
                break;
            case '-':
                keyEvent.preventDefault();
                show(null, '-');            
                break;
            case '+':
                keyEvent.preventDefault();
                show(null, '+');            
                break;
            case '.':
                keyEvent.preventDefault();
                show(null, '.');
                break;
            }    

        // Faccio questo poiché all'inserimento della prima cifra il valore è per qualche motivo ""
        displayedValue = `${keyEvent.key}${document.getElementById('value-displayer').value}`
    }
    
})

function valueController (value){
    // Valore da mostrare
    let valueToDisplay = '';
    // Indice dell'ultimo carattere inserito
    const lastChar = displayedValue.length-1;
    // Array contenente gli elementi da controllare
    const symbolsArray = ['×', '÷', '-', '+', '%'];

    // Se il carattere da inserire appartiene ad un array ma è preceduto da un altro simbolo non viene inserito
    if((value === symbolsArray[0] || value === symbolsArray[1] || value === symbolsArray[4]) && (displayedValue.length === 0)){
        valueToDisplay += '';
    } else if (symbolsArray.includes(displayedValue[lastChar]) && symbolsArray.includes(value)) {   // Se l'ultimo carattere nel display e quello appena inserito sono entrambi operatori, il secondo non viene inserito
        valueToDisplay += '';
    } else if (value === '.') {
        // Se il bottone risulta disabilitato significa che nel numero corrente è già presente un punto
        if(document.getElementById('decimal-point-btn').disabled){
            valueToDisplay += '';
        }else{
            valueToDisplay += '.'
            // Al click del bottone punto viene disabilitato il bottone per evitare che si possa reinserire nello stesso numero
            document.getElementById('decimal-point-btn').disabled = true;
        }
    } else if (symbolsArray.includes(displayedValue[lastChar])){
        // Se l'ultimo carattere inserito è un segno viene riabilitato il bottone del punto
        document.getElementById('decimal-point-btn').disabled = false;
        // Valore premuto viene inserito
        valueToDisplay += value;
    } else if (symbolsArray.includes(value)){
        valueToDisplay += value;
        document.getElementById('decimal-point-btn').disabled = false;
    } else {
        valueToDisplay += value;    
    }

    return valueToDisplay;
}

// Viene mostrato nel campo di input il valore del bottone premuto o del simbolo passato
function show(btnClicked, keySymbol) {
    // Se il valore del bottone è null allora la variabile assume il valore del secondo parametro
    let value = btnClicked === null ? keySymbol : btnClicked.innerText;
    
    // Viene mostrato il valore inserito
    document.getElementById('value-displayer').value += valueController(value);

    // Viene aggiornata la variabile per comprendere quello che è stato appena aggiunto
    updateDisplayedValue()
}

function brackets() {
    // Contatore delle parentesi aperte
    let openBracketsCounter = 0;
    // Contatore delle parentesi chiuse
    let closedBracketsCounter = 0;
    
    // Controlla ogni carattere, se è una parentesi aperta incrementa di uno il contatore relativo e viceversa per parentesi chiuse
    for(let char of displayedValue){
        if(char === '('){
            openBracketsCounter++;
        }else if(char === ')'){
            closedBracketsCounter++;
        }
    }

    //Se il numero di parentesi aperte e chiuse è uguale allora la parentesi inserita sarà aperta
    if (openBracketsCounter === closedBracketsCounter){
        document.getElementById('value-displayer').value+='(';
    }else{
        document.getElementById('value-displayer').value+=')';
    }

    // Sincronizzazione
    updateDisplayedValue();
}

function transformPercentage (valueToCheck) {
    // regex /\d+%/g significa tutte le cifre da almeno 1 a n e percentuale

    // valueToCheck diventa il suo valore ma ogni match effettuato viene rimpiazzato dal corrispondente numerico
    valueToCheck = valueToCheck.replace(/\d+%/g, (match) => {
        let modifiedValue = parseInt(match.slice(0, -1))/100;
        return modifiedValue;
    })

    return valueToCheck;
}

// Funzione che rimpiazza ogni match con la regex (parametro search) con il suo valore modificato secondo l'operazione associata 
function transformingFunc (value, search, operation){
    let correctValue = value.replace(search, (match) => {
        let modifiedValue = operation(match);
        return modifiedValue;
    })

    return correctValue;
}


function transformScientifics(valueToCheck){
    /*
    Ho creato un array contenente degli oggetti con proprietà regex, ovvero il pattern di caratteri che devono essere riconosciuti
    ed estrapolati, e il metodo operation che contiene appunto l'operazione da effettuare.
    L'array è assolutamente antiestetico ma mi risparmiava il dover scrivere a mano ogni volta il richiamo della funzione che effettuava il match e la
    sostituzione che avrebbe reso ancora più lungo il tutto. 
    */

    const regexOperations = [
        {regex: /\d+²/g, operation: (match) => {return Math.pow(parseInt(match.slice(0, -1)), 2);}},
        {regex: /\d+³/g, operation: (match) => {return Math.pow(parseInt(match.slice(0, -1)), 3)}},
        {regex: /√\(\d+\)/g, operation: (match) => {return Math.sqrt(parseInt(match.slice(2, match.length-1)))}},
        {regex: /∛\(\d+\)/g, operation: (match) => {return Math.cbrt(parseInt(match.slice(2, match.length-1)))}},
        {regex: /ln\(\d+\)/g, operation: (match) => {return Math.log(match.slice(3, match.length-1))}},
        {regex: /log\(\d+\)/g, operation: (match) => {return Math.log10(match.slice(4, match.length-1))}},
        // Il numero inserito viene moltiplicato per il pi greco e diviso per 180 gradi cosi che diventa in radiale
        {regex: /sin\(\d+\)/g, operation: (match) => {return Math.sin(match.slice(4, match.length-1) * Math.PI / 180)}},
        {regex: /cos\(\d+\)/g, operation: (match) => {return Math.cos(match.slice(4, match.length-1) * Math.PI / 180)}},
        {regex: /tan\(\d+\)/g, operation: (match) => {return Math.tan(match.slice(4, match.length-1) * Math.PI / 180)}},
        // {regex: , operation: (match) => {return Math.}},
    ]

    // Per ogni oggetto nell'array viene chiamata la funzione transforminfFunc()
    regexOperations.forEach(({regex, operation}) => {
        valueToCheck = transformingFunc(valueToCheck, regex, operation); 
    })

    // Ritorna il valore manipolato
    return valueToCheck;
}

function result() {
    // Prende come valore finale per eseguire l'operazione il valore all'interno del display
    updateDisplayedValue();

    // Creo una stringa in cui i valori non valutabili sono sostituiti con gli operatori originali
    let evaluatableText = displayedValue
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/-/g, '-');
    
    // Trasforma i valori percentuali in un valore numerico, dividendo il numero affiancato a % per 100
    evaluatableText = transformPercentage(evaluatableText);

    // Trasforma tutte le operazioni speciali nei loro risultati
    evaluatableText = transformScientifics(evaluatableText)

    // Uso try catch per eseguire un determinato codice se eval() ritorna un errore.
    try {
        // Valuta in codice una stringa, così che le operazioni vengano eseguite
        let resultingValue = eval(evaluatableText);
        // Il risultato è stampato nel displayer
        document.getElementById('value-displayer').value = resultingValue;
        // Funzione che crea un nuovo elemento cronologia
        newHistory();
    } catch (error) {
        let numbersDisplayer = document.getElementById('numbers-display');
        numbersDisplayer.style.borderColor = 'red';
        document.getElementById('value-displayer').value = 'ERROR';
    }
    
    // Sincronizzazione
    updateDisplayedValue();
}

// Funzione che al click dell'elemento nella cronologia lo reinserisce nel display principale
function showHistory(btnClicked){
    document.getElementById('value-displayer').value = btnClicked.innerText;
    // Aggiornamento del displayValue
    updateDisplayedValue();
}

function deleteLast(){
    // Aggiorno il valore di display 
    updateDisplayedValue();
    // Se l'ultimo carattere è un punto allora viene riabilitato il bottone del punto
    if(displayedValue.charAt(displayedValue.length-1) === '.'){
        document.getElementById('decimal-point-btn').disabled = false;
    }
    // Rimuovo l'ultimo carattere assegnando al valore di display la sottostringa dal primo al penultimo carattere
    displayedValue = displayedValue.slice(0, displayedValue.length-1);
    // Mostro il valore di display
    document.getElementById('value-displayer').value = displayedValue;
}

function reset() {
    // Riabilita il bottone del punto
    document.getElementById('decimal-point-btn').disabled = false;
    // Svuota il displayer
    document.getElementById('value-displayer').value = '';
    // Sincronizzazione del valore mostrato e del valore interno
    updateDisplayedValue();
}

function newHistory(){
    // Elemento della lista Cronologia creato
    let historyElement = document.createElement('li');
    // Viene aggiunta una classe per gli stili all'elemento della lista
    historyElement.classList.add('list-item-operation');
    // Elemento bottone creato
    let historyBtn = document.createElement('button');
    // Viene aggiunta una funzione da eseguire quando il bottone creato è premuto
    historyBtn.onclick = () => { showHistory(historyBtn) }
    // Viene aggiunta uno stile al bottone
    historyBtn.classList.add('operation');
    // Viene inserito come testo del bottone l'operazione appena eseguita
    historyBtn.innerHTML = displayedValue;
    // Il bottone viene inserito nell'elemento della lista
    historyElement.appendChild(historyBtn);
    // L'elemento della lista viene inserito nella lista
    document.getElementById('history-list').appendChild(historyElement);
}

// Funzione per agevolare l'update del displayValue
function updateDisplayedValue () {
    displayedValue = document.getElementById('value-displayer').value;
}

function changeColorMode(){
    if(document.getElementById('colorMode').getAttribute('href') === 'styles/light.css'){
        document.getElementById('colorMode').setAttribute('href', 'styles/dark.css');
    }else{
        document.getElementById('colorMode').setAttribute('href', 'styles/light.css'); 
    }
}