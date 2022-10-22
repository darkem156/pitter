<template>
  <div>
    <div class="user-info-container">
      <p class="user-info">Nombre: {{ data.name }}</p>
      <div class="user-data-container">
        <p class="user-info">Usuario: @{{ data.user_name }}</p>
        <p class="user-info">Id de usuario: {{ data.id }}</p>
        <p class="user-info">Seguidores: {{ data.followers }}</p>
        <p class="user-info">Siguiendo: {{ data.following }}</p>                
      </div>
      <button v-if="!data.followed" v-on:click="follow" class="button-follow">Follow</button>
      <button v-else v-on:click="unFollow" class="button-unfollow">Unfollow</button>
    </div>
    <div>
      <div id="publicaciones-container">
        <h2 id="publicaciones">Publicaciones</h2>
      </div>
      <div v-for="item in data.publications" :key ="item">
        <div class="publication-container">
          <div class="publication-data">
            <div class="user-data">
              <div class="nombreUsuario"><a v-bind:href="'/user/' + item.id_usuario">{{data.name}}</a></div>
              <div class="user-name"><p>@{{ data.user_name }}</p></div>
            </div>  
            <div class="fecha">
              <div></div>
              <div></div>
              <div class="fecha-fecha">{{ item.date.split('.')[0].split('T')[0].replace('-', '/').replace('-', '/') }}</div>
            <div class="fecha-hora"><p>{{ item.date.split('.')[0].split('T')[1].substring(0, 5) }}</p></div>
          </div>
        </div>
        <div class="publication-content">
          <p>{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  setup() 
  {
    return {
      data: {}
    }
  },
  mounted()
  {
    this.getUser().then(data =>
    {
      this.data = data;
      this.$forceUpdate();
    })
  },
  methods:
  {
    async getUser()
    {
      let user = parseInt(window.location.href.split('/')[4]);
      let response = await fetch(`/api/user/${user}`,
      {
        method: 'GET',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let res = await response.json();
      return res;
    },
    async follow()
    {
      let user = parseInt(window.location.href.split('/')[4]);
      let response = await fetch(`/api/user/${user}/follow`,
      {
        method: 'GET',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let res = await response.json();
      if(res.followed === 'followed')
      {
        this.data.followed = true;
        this.$forceUpdate();
      }
      else console.log(res.followed);
    },
    async unFollow()
    {
      let user = parseInt(window.location.href.split('/')[4]);
      let response = await fetch(`/api/user/${user}/unFollow`,
      {
        method: 'GET',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let res = await response.json();
      console.log(res)
      if(res.followed === 'unfollowed')
      {
        this.data.followed = false;
        this.$forceUpdate();
      }
    }
  }
}
</script>
