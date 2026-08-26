import { getToken } from '../components/auth/auth-helper';

let apiURL = process.env.REACT_APP_APIURL


export const getQuestionsForPost = async (id) => {
    try {
        const response = await fetch(`${apiURL}/questions/post/${id}`, { // Fixed route
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        return await response.json();
    } catch (err) {
        console.log("Error fetching questions for post:", err);
    }
};


// Function to add a question
export const addQuestion = async (id, questionText) => {
    try {
        const response = await fetch(`${apiURL}/questions/${id}/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: questionText,
            }),
        });
        return await response.json();
    } catch (err) {
        console.log("Error adding question:", err);
    }
};

// Function to answer a question
// export const answerQuestion = async (questionId, answerText) => {
//     try {
//         const response = await fetch(`${apiURL}/questions/${questionId}/answer`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': 'Bearer ' + getToken(),
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 answer: answerText,
//             }),
//         });
//         return await response.json();
//     } catch (err) {
//         console.log("Error answering question:", err);
//     }
// };

export const answerQuestion = async (id, answerText) => {
    try {
        const token = getToken();
        console.log("Token being sent:", token); // Log the token
        let response = await fetch(apiURL + '/questions/answer/' + id, { // Fixed the route with a '/' before id
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`, // Include the token
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer: answerText }),
        });
        return await response.json();
    } catch (err) {
        console.error("Error answering question:", err);
        throw err;
    }
};





