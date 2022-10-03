<template>
  <div v-if="data.logIn">
    <form @submit.prevent="logIn" id="form-sign-in">
      <input type="text" placeholder="Email o Usuario" class="text-sign" v-model="datos.dato">
      <input type="password" placeholder="Password" class="text-sign" v-model="datos.password">
      <button class="button-sign">Sign In</button>
    </form>
    <button v-on:click="changeForm" class="changeForm" >No tengo una cuenta</button>
  </div>
  <div v-else>
    <form @submit.prevent="signUp" id="form-sign-in">
      <input class="text-sign" placeholder="name" v-model="datos.name" type="text">
      <input class="text-sign" placeholder="user name" v-model="datos.user_name" type="text" name="" id="">
      <input class="text-sign" placeholder="email" v-model="datos.email" type="text">
      <input class="text-sign" placeholder="password" v-model="datos.password" type="password" name="" id="">
      <button class="button-sign">Sign Up</button>
    </form>
    <button v-on:click="changeForm" class="changeForm">Ya tengo una cuenta</button>
  </div>  
</template>
<script>
export default {
    setup() 
    {
      return {
        data:
        {
          logIn: true,
        },
        datos:
        {
          dato: '',
          password: ''
        }
      }
    },
    methods: {
      async logIn()
      {
        console.log(this.datos);
        fetch('/api/signIn',
        {
          method: 'POST',
          body: JSON.stringify(this.datos),
          headers:
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json()) //res.json())
        .then(data =>
        {
          if(data.error)
          {
            this.$emit("error", data.error)
            console.log(data.error);
            return;
          }
          location.reload()
        })
      },
    changeForm()
    {
      if(this.data.logIn) this.data.logIn = false;
      else this.data.logIn = true;
      this.$forceUpdate();
    },
    async signUp()
    {
      let response = await fetch('/api/signUp',
      {
        method: 'POST',
        body: JSON.stringify(this.datos),
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let res = await response.json();
      console.log(res);
      if (res.error) this.$emit('error', res.error)
      else
      {
        this.datos = {};
        location.reload();
      }
    },
  },
}
</script>
