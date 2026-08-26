import { getToken } from "../components/auth/auth-helper";
let apiURL = process.env.REACT_APP_APIURL
console.log('API URL:', apiURL);

const list = async () => {
    try {
        let response = await fetch(apiURL + '/posts/list', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return await response.json();
    } catch (err) {
        console.log(err)
    }
}

const userList = async () => {
    try {
        let response = await fetch(apiURL + '/posts/user-list', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken() // Include the token
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

/*
const create = async (post) => {
    try {
        let response = await fetch(apiURL + '/posts/add/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ getToken()
            },
            body: JSON.stringify(post)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}*/

const create = async (post) => {
    try {
        let response = await fetch(apiURL + '/posts/add/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
            },
            body: post, // Pass the FormData object directly
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};


const remove = async (id) => {
    try {
        let response = await fetch(apiURL + '/posts/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ getToken()
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const disable = async (id) => {
    try {
        let response = await fetch(apiURL + '/posts/disable/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ getToken()
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}
/*
const update = async (id, ad) => {
    try {
        let response = await fetch(apiURL + '/posts/edit/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(ad)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}*/

const update = async (id, ad) => {
    try {
        let response = await fetch(apiURL + '/posts/edit/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
            },
            body: ad // Pass the FormData object directly
        })
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}


const read = async (id) => {
    try {
        let response = await fetch(apiURL + '/posts/get/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}


export { list, remove, disable, create, update, read, userList}