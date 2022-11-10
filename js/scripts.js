class Book{
    constructor(title,author,genre,total,read,left,rate,isbn){
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.total = total;
        this.read = read;
        this.left = left;
        this.rate = rate;
        this.isbn = isbn;
    }
}

class UI{

    static displayBooks() {
		const books = Store.getBooks();
		books.forEach((book) => UI.addBookToList(book));
	}

    static addBookToList(book) {
       const bookList = document.querySelector('.booklist-items');
       const bookListItem = document.createElement('div');
       bookListItem.className =`booklist-item flex justify-between`;
       bookListItem.innerHTML =
       `<div class="m-2 text-left w-full title">${book.title}</div>
       <div class="m-2 text-left w-full author">${book.author}</div>
       <div class="m-2 text-left w-full">${book.genre}</div>
       <div class="m-2 text-left w-full">${book.total}</div>
       <div class="m-2 text-left w-full">${book.read}</div>
       <div class="m-2 text-left w-full">${book.left}</div>
       <div class="m-2 text-left w-full">${book.rate}<i class="fa-solid fa-star text-yellow-500"></i></div>
       <div class="m-2 text-left w-full">${book.isbn}</div>
       <div class="m-2 text-left w-full"><button data-isbn="${book.isbn}" class="delete-btn bg-red-500 text-white py-1 px-2 rounded">X</button></div>`
       bookList.appendChild(bookListItem);

       document.querySelector("#book-form").reset();
      };

    static deleteBookFromList(book){
       book.parentElement.parentElement.remove();
       this.message('Book has been deleted', 'bg-red-500');
    } 
    static message(message, color) {
        let messageBox = document.createElement("messageBox");
        messageBox.className =`'w-full py-3 px-4 rounded text-white message ${color}`;
        messageBox.style.position = "absolute";
        let messageText = document.createTextNode(message);
        messageBox.appendChild(messageText);
        const title = document.querySelector('.header');
		title.appendChild(messageBox, title);

        setTimeout(function(){
            $('.message').hide()
        }, 3000) // time in millisecond for as long as you like
    };
}

class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}
	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}
	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem('books', JSON.stringify(books));
	}
} 

document.addEventListener('DOMContentLoaded', UI.displayBooks);
document.querySelector('#book-form').addEventListener('submit', (e) => { 

    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const total = document.querySelector('#pages').value;
    const read = document.querySelector('#read').value;
    const isbn = document.querySelector('#isbn').value;
    const rate = document.querySelector('input[name="rate"]:checked').value;
    const genre = document.querySelector('input[name="genre"]:checked').value;
    const left = total-read;
 
    if(title === '' || author === '' || isbn === '' || total <= 0 || read <= 0 || rate <= 0 || genre <= 0){
        UI.message('Please fill in all inputs', 'bg-red-500');
    }else{
        const book = new Book(title, author,genre,total,read,left,rate,isbn);
        UI.addBookToList(book);
        Store.addBook(book);
        UI.message('Book has been added', 'bg-green-500');

    }
});

document.querySelector('.booklist-items').addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.classList.contains('delete-btn')) {
            UI.deleteBookFromList(e.target);    
            Store.removeBook(e.target.dataset["isbn"]);
        }

});

let bookInput = document.getElementById('book-search-input'); 
let authorInput = document.getElementById('author-search-input');
let book = document.getElementsByClassName("booklist-item");

document.getElementById("book-search").addEventListener('click', function(){
bookInput.style.display = "block"
authorInput.style.display = "none"  
});
document.getElementById("author-search").addEventListener('click', function(){
bookInput.style.display = "none"
authorInput.style.display = "block"  
});

authorInput.addEventListener('keyup', filterAuthor);
function filterAuthor(){
let filterValues = document.getElementById('author-search-input').value.toUpperCase();
for(let i = 0;i < book.length;i++){
    let b = book[i].getElementsByClassName('author')[0];
    console.log(b.innerHTML);
    if(b.innerHTML.toUpperCase().indexOf(filterValues) > -1){
    book[i].style.display = '';
    } else {
        book[i].style.display = 'none';
    }
    }
}
  
bookInput.addEventListener('keyup', filterTitles);
function filterTitles(){
    let filterValue = document.getElementById('book-search-input').value.toUpperCase();
    for(let i = 0;i < book.length;i++){
        let a = book[i].getElementsByClassName('title')[0];
        if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
            book[i].style.display = '';
        } else {
            book[i].style.display = 'none';
        }
    }
}
  