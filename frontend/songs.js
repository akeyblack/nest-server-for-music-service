songBtn = document.getElementById("getMySongs");
regBtn = document.getElementById("regBtn");
loginBtn = document.getElementById("loginBtn");

regForm = document.getElementById("regForm");
loginForm = document.getElementById("loginForm");


songBtn.addEventListener("click", e => {
    e.preventDefault();

    fetch('http://localhost:3000/songs/my', {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log("Songs: \n" + data);
    })  
});

regBtn.addEventListener("click", e => {
    e.preventDefault();
    const data = new URLSearchParams();
    for (const pair of new FormData(regForm)) {
        data.append(pair[0], pair[1]);
    }

    fetch('http://localhost:3000/auth/register', {
        method: "POST",
        body: data
    }).then((response) => {
        return response.json();
    }).then((data) => {
        localStorage.setItem("accessToken", data.accessToken);
    });
});

loginBtn.addEventListener("click", e => {
    e.preventDefault();
    const data = new URLSearchParams();
    for (const pair of new FormData(loginForm)) {
        data.append(pair[0], pair[1]);
    }

    fetch('http://localhost:3000/auth/login', {
        method: "POST",
        body: data
    }).then((response) => {
        return response.json();
    }).then((data) => {
        localStorage.setItem("accessToken", data.accessToken);
    });
});