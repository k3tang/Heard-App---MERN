
import { Redirect } from 'react-router-dom';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';



const RECEIVE_CONFESSIONS = "confessions/RECEIVE_CONFESSIONS";
const RECEIVE_USER_CONFESSIONS = "confessions/RECEIVE_USER_CONFESSIONS";
const RECEIVE_NEW_CONFESSION = "confessions/RECEIVE_NEW_CONFESSION";
const REMOVE_CONFESSION = "confessions/REMOVE_CONFESSION";
const RECEIVE_CONFESSION_ERRORS = "confessions/RECEIVE_CONFESSION_ERRORS";
const CLEAR_CONFESSION_ERRORS = "confessions/CLEAR_CONFESSION_ERRORS";

const receiveConfessions = confessions => ({
    type: RECEIVE_CONFESSIONS,
    confessions
});

// const receiveUserConfessions = confessions => ({
//     type: RECEIVE_USER_CONFESSIONS,
//     confessions
// });

const receiveNewConfession = confession => ({
    type: RECEIVE_NEW_CONFESSION,
    confession
});

const receiveErrors = errors => ({
    type: RECEIVE_CONFESSION_ERRORS,
    errors
});

const removeConfession = (id) => ({
       type: REMOVE_CONFESSION,
       id 
   });


export const clearConfessionErrors = errors => ({
    type: CLEAR_CONFESSION_ERRORS,
    errors
});

export const getConfessions = state => {
    if (!state) return [];
    if(!state.confessions) {
        return []
    } else {
        return Object.values(state.confessions)
    }
}

//thunk action creators 

export const fetchConfessions = () => async dispatch => {
    try {
        const res = await jwtFetch("/api/confessions");
        const confessions = await res.json();
        return dispatch(receiveConfessions(confessions))
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors))
        }
    }
};

export const fetchUserConfessions = id => async dispatch => {
    try {
        const res = await jwtFetch(`/api/confessions/user/${id}`);
        const confessions = await res.json();
        dispatch(receiveConfessions(confessions));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
};

export const createConfession = data => async dispatch => {
    try {
        const res = await jwtFetch('/api/confessions/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const confession = await res.json();
     
       return dispatch(receiveNewConfession(confession));
        
    } catch (err) {
        const resBody = await err.json();
    
        if (resBody.statusCode === 500) {
            return dispatch(receiveErrors(resBody.errors));
        } else {
           
        }
    }
};


export const deleteConfession = id => async dispatch => {
        const res = await jwtFetch(`/api/confessions/${id}`, {
            method: 'DELETE'
        });
        return dispatch(removeConfession(id))
}


//reducers 

const nullErrors = null;

export const confessionErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_CONFESSION_ERRORS:
            return action.errors;
        case CLEAR_CONFESSION_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const confessionsReducer = (state = { }, action) => {
    Object.freeze(state);
    let newState = {...state}
    switch (action.type) {
        case RECEIVE_CONFESSIONS:
            for(let confession of action.confessions) {
              newState[confession._id] = confession;
            }
            return {...newState};
        // case RECEIVE_USER_CONFESSIONS:
        //    for(let confession of action.confessions) {
        //       newState.user[confession._id] = confession;
        //     }
        //     return newState;
        case RECEIVE_NEW_CONFESSION:
            newState[action.confession._id] = action.confession;
            return newState;
        case RECEIVE_USER_LOGOUT:
            return { ...state, user: {}, new: undefined };
        case REMOVE_CONFESSION:
            delete newState[action.id];
            return newState;
        default:
            return state;
    }
};

export default confessionsReducer;
