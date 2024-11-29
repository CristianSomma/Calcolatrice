let displayedValue = '';

document.addEventListener('DOMContentLoaded', () => {
    // Valore già inserito
    displayedValue = document.getElementById('value-displayer').value;
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
            case '%':
                keyEvent.preventDefault();
                show(null, '%×')
                break;
        }    

        // Faccio questo poiché all'inserimento della prima cifra il valore è per qualche motivo ""
        displayedValue = `${keyEvent.key}${document.getElementById('value-displayer').value}`
    }
    
})

// Viene mostrato nel campo di input il valore del bottone premuto o del simbolo passato
function show(btnClicked, keySymbol) {
    // Valore da mostrare
    let valueToDisplay = '';
    // Se il valore del bottone è null allora la variabile assume il valore del secondo parametro
    let value = btnClicked === null ? keySymbol : btnClicked.innerText;
    // Indice dell'ultimo carattere inserito
    const lastChar = displayedValue.length-1;
    // Array contenente gli elementi da controllare
    const symbolsArray = ['×', '÷', '-', '+', '%'];

    // Se il carattere da inserire appartiene ad un array ma è preceduto da un altro simbolo non viene inserito
    if((value === symbolsArray[0] || value === symbolsArray[1] || value === symbolsArray[4]) && (displayedValue.length === 0)){
        valueToDisplay += '';
    } else if (symbolsArray.includes(displayedValue[lastChar]) && symbolsArray.includes(value)) {
        valueToDisplay += '';
    } else if (value === symbolsArray[4]){
        valueToDisplay += '%×';
    } else {
        valueToDisplay += value;    
    }

    // Viene mostrato il valore inserito
    document.getElementById('value-displayer').value += valueToDisplay;

    // Viene aggiornata la variabile per comprendere quello che è stato appena aggiunto
    displayedValue = document.getElementById('value-displayer').value
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
    displayedValue = document.getElementById('value-displayer').value;
}

function result() {
    // Prende come valore finale per eseguire l'operazione il valore all'interno del display
    displayedValue = document.getElementById('value-displayer').value;

    // Creo una stringa in cui i valori non valutabili sono sostituiti con gli operatori originali
    let evaluatableText = displayedValue
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/-/g, '-');
    
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
    displayedValue = document.getElementById('value-displayer').value;
}

function showHistory(btnClicked){
    document.getElementById('value-displayer').value = btnClicked.innerText;
    displayedValue = document.getElementById('value-displayer').value;
}

function deleteLast(){
    displayedValue = displayedValue.substring(0, displayedValue.length-1);
    document.getElementById('value-displayer').value = displayedValue;
}

function reset() {
    // Svuota il displayer
    document.getElementById('value-displayer').value = '';
    // Sincronizzazione del valore mostrato e del valore interno
    displayedValue = document.getElementById('value-displayer').value
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