const adminLogin = 'liljta';
const adminPass = 'pass';

const Init = function () {
    CheckRole();
    LoadData();
};


const CheckRole = function () {
    let role =  localStorage.getItem('role');
    let username = localStorage.getItem('username');

    let authForm = document.querySelector('#auth form');
    let authMessage = document.querySelector('#auth p');
    let authUser = document.querySelector('#auth p span');

    if (role === 'admin' && username){
        authForm.classList.add('d-none');
        authUser.innerHTML = username;
        authMessage.classList.remove('d-none');
        document.querySelector('.logout').addEventListener('click', Logout);
        document.querySelector('button.signin').removeEventListener('click', SignIn);
    } else {
        authMessage.classList.add('d-none');
        authForm.classList.remove('d-none');
        document.querySelector("button.signin").addEventListener("click", SignIn);
        document.querySelector('.logout').removeEventListener('click', Logout);
    }
};

const SignIn = function (e) {
    e.preventDefault();
    let login = document.querySelector("#auth form .login").value;
    let pass = document.querySelector('#auth form .pass').value;
    //console.log(`${login}===${pass}`);

    if (adminLogin === login && adminPass === pass){
        localStorage.setItem('username', login);
        localStorage.setItem('role', 'admin');
        CheckRole();
    }
    else{
        alert('Invalid login or password');
    }
};

const Logout = function () {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    CheckRole();
};

const LoadData = function (pageNum = 1) {
    ShowLoader2();
    let starPromise = new Promise(function (resolve, reject) {
        let url = `https://swapi.co/api/people/?page=${pageNum}`;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                reject();
            } else {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
            }
        };
    }).then(function (data) {
        ShowPersons(data, pageNum);
    }).catch(function () {
        ShowError();
    });
};

const ShowError = function () {
    let tbody = document.querySelector('.persons');
    tbody.innerHTML = '';
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.colSpan = 5;
    td.innerHTML = 'Oops! Something went wrong :(';
    tr.appendChild(td);
    tbody.appendChild(tr);
};

function ShowPersons(data, pageNum) {
    let tBody = document.querySelector(".persons");
    tBody.innerHTML = '';
    for (let i = 0; i < data.results.length; i++) {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        tdName.innerText = data.results[i].name;
        tr.appendChild(tdName);
        let tdHeight = document.createElement('td');
        tdHeight.innerText = data.results[i].height;
        tr.appendChild(tdHeight);
        let tdEye_color = document.createElement('td');
        tdEye_color.innerText = data.results[i].eye_color;
        tr.appendChild(tdEye_color);
        let tdSkin_color = document.createElement('td');
        tdSkin_color.innerText = data.results[i].skin_color;
        tr.appendChild(tdSkin_color);
        let tdBirth_year = document.createElement('td');
        tdBirth_year.innerText = data.results[i].birth_year;
        tr.appendChild(tdBirth_year);
        tBody.appendChild(tr);
    }
    MakePagination(Math.ceil(data.count/10), pageNum);
}

const ShowLoader = function() {
    let tBody = document.querySelector(".persons");
    tBody.innerHTML = '';
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let colspan = document.createAttribute('colspan');
    colspan.value = 5;
    td.setAttributeNode(colspan);
    td.classList.add('text-center');
    let div = document.createElement('div');
    div.classList.add('spinner-border');
    div.classList.add('text-success');
    let role = document.createAttribute('role');
    role.value = 'status';
    div.setAttributeNode(role);
    let span = document.createElement('span');
    span.classList.add('sr-only');
    span.innerText = 'Loading...';
    div.appendChild(span);
    td.appendChild(div);
    tr.appendChild(td);
    tBody.appendChild(tr);
};

const ShowLoader2 = function() {
    let tBody = document.querySelector(".persons");
    tBody.innerHTML = '';
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.colSpan = 5;
    let div = document.querySelector('.sw-loader').cloneNode(true);
    div.classList.remove('d-none');
    td.appendChild(div);
    tr.appendChild(td);
    tBody.appendChild(tr);
};

const MakePagination = function (num, current) {
    let pagination = document.querySelector('.pages');
    pagination.innerHTML = '';
    let nav = document.createElement('nav');
    let ul = document.createElement('ul');
    ul.classList.add('pagination');
    for (let i = 1; i<=num; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        if (i === current) {
            li.classList.add('active');
        }
        let a = document.createElement('a');
        a.classList.add('page-link');
        let urlAttr = document.createAttribute('href');
        urlAttr.value = `javascript:LoadData(${i})`;
        a.setAttributeNode(urlAttr);
        a.innerText = i;
        li.appendChild(a);
        ul.appendChild(li);
    }
    nav.appendChild(ul);
    pagination.appendChild(nav);
};




window.addEventListener('load', Init);
