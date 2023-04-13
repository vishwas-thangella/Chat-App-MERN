import { createSlice , configureStore } from '@reduxjs/toolkit';

const slice = createSlice({
    name:"slice",
    initialState:{
        Auth:false,
        MobileView:false,
        Drawer:false,
    },
    reducers:{
        setAuth(state,actions){
            state.Auth = actions.payload;
        },
        setMobileView(state,actions){
            state.MobileView = actions.payload;
        },
        setDrawer(state,actions){
            state.Drawer = actions.payload;
        }
    }
});
const Store = configureStore({
    reducer:slice.reducer
});
const Actions = slice.actions;

export { Actions, Store };