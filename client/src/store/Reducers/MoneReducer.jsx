const mone={
value: 0
}

const reducer=(state=mone,action)=>{

    switch(action.type){
case "currect":
return{
    value: state.value+10
}
default:
    return state

    }
}

export default reducer