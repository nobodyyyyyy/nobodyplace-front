import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// todo 模块
const ACTION_CREATE = 0;
const ACTION_EDIT = 1;

export default new Vuex.Store({
    state: {
        user: {
            username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
        },
        searchEngine: window.localStorage.getItem('searchEngine') == null ?
            'search_engine_google' : window.localStorage.getItem('searchEngine'),
        suggestionEngine: window.localStorage.getItem('suggestionEngine') == null ?
            'suggestion_engine_bing' : window.localStorage.getItem('suggestionEngine'),
        countDownEvents: window.localStorage.getItem('countDownEvents') == null ? [] : JSON.parse(window.localStorage.getItem('countDownEvents'))
    },
    // 同步
    mutations: {
        login (state, user) {
            state.user = user
            window.localStorage.setItem('user', JSON.stringify(user))
        },
        searchEngineChange(state, engine) {
            state.searchEngine = engine
            window.localStorage.setItem('searchEngine', engine)
        },
        suggestionEngineChange(state, engine) {
            state.suggestionEngine = engine;
            window.localStorage.setItem('suggestionEngine', engine)
        },

        // todo import by module
        // ------- countdowns begin -------
        initCountDownEvents(state, [eventLists, fromCache]) {
            let countDowns = [];
            if (fromCache) {
                eventLists = JSON.parse(window.localStorage.getItem('countDownEvents'));
            } else {
                window.localStorage.setItem('countDownEvents', JSON.stringify(eventLists))
            }
            for (let i = 0; i < eventLists.length; ++i) {
                try {
                    let event = eventLists[i];
                    let expirationTime = eventLists[i]['expirationDate'].split(' ')[0];
                    let endTime = new Date(eventLists[i]['expirationDate'].replace('/-/g', ':'));
                    let remainingTime = Math.ceil((endTime - (new Date()).getTime()) / (24 * 3600 * 1000));
                    countDowns.push({
                        id: event['id'],
                        name: event['eventName'],
                        remainingTime: remainingTime,
                        expirationTime: expirationTime,
                        measurement: 'd',
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            state.countDownEvents.length = 0;
            countDowns.forEach((obj, idx) => {
                state.countDownEvents.push(obj)
            });
            state.countDownEvents.sort((x, y) => {
                return x['remainingTime'] - y['remainingTime'];
            });
        },
        updateCountDownEvent(state, newEvent) {
            const event = {
                id: newEvent.id,
                name: newEvent.name,
                remainingTime: newEvent.remainingTime,
                expirationTime: newEvent.expirationTime,
                measurement: newEvent.measurement
            }
            if (newEvent.action === ACTION_EDIT) {
                this.commit('deleteCountDownEvent', newEvent.id);
            }
            state.countDownEvents.push(event)
            state.countDownEvents.sort((x, y) => {
                // 目前单位都是 d，先不考虑其他情况
                return x['remainingTime'] - y['remainingTime'];
            });
            window.localStorage.setItem('countDownEvents', JSON.stringify(state.countDownEvents))
            // Vue.set(state.countDownEvents, "name", obj)
        },
        deleteCountDownEvent(state, id) {
            if (!state.countDownEvents || state.countDownEvents.length === 0) {
                return;
            }
            for (let i = 0; i < state.countDownEvents.length; ++i) {
                if (state.countDownEvents[i].id === id) {
                    state.countDownEvents.splice(i, 1);
                    window.localStorage.setItem('countDownEvents', JSON.stringify(state.countDownEvents))
                    return;
                }
            }
        }
        // ------- countdowns end -------
    },
    // 异步
    actions: {
    },
    getters: {
        getCountDownEvents(state) {
            return state.countDownEvents;
        }
    },
    modules: {
    }
})
