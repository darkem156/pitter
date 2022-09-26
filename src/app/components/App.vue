<template>
  <div>
    <div v-show="data.error" class="alert alert-danger alert-dismissible fade show" role="alert" id="alert">
      {{ data.error }}
      <button v-on:click="closeAlert" type="button" class="close" id="close-alert">
        <span>&times;</span>
      </button>
    </div>
    <div v-if="!data.session" id="sign-container">
      <Sign v-on:error="error" />
    </div>
    <div v-else>
      <div id="form-publish-container">
        <form @submit.prevent="publicar" id="form-publish">
          <div id="text-publish-container">
            <input type="text" placeholder="¡Publica algo!" v-model="data.content" name="" id="text-publish">
          </div>
          <div id="button-publish-container">
            <button id="button-publish">Publicar</button>
          </div>
        </form>
      </div>
      <div v-for="item in data.array" :key="item">
        <div class="publication-container">
          <div class="publication-data">
            <div class="user-data">
              <div class="nombreUsuario"><a v-bind:href="'/user/' + item.id_usuario">{{item.name}}</a></div>
              <div class="user-name"><p>@{{ item.user_name }}</p></div>
            </div>  
            <div class="fecha">
            <div></div>
            <div></div>
            <div class="fecha-fecha">{{ item.date.split('.')[0].split('T')[0].replace('-', '/').replace('-', '/') }}</div>
            <div class="fecha-hora"><p>{{ item.date.split('.')[0].split('T')[1].substring(0, 5) }}</p></div>
            </div>
          </div>
          <div class="publication-content">
            <p>{{ item.contenido }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sign from './Sign.vue'

export default {
  components:
  {
    Sign,
  },
  setup() 
  {
    return {
      data:
      {
        session: false,
        array: [],
        content: '',
        error: "",
      },
    }
  },
  mounted()
  {
    this.session().then(data => 
    {
      this.data.session = data
      this.getPublications().then(array =>
      {
        this.data.array = array;
        this.$forceUpdate();
      })
    })
  },
  methods:
  {
    async session()
    {
      var resp = await fetch('/api/initSession',
      {
        method: 'POST',
        body: JSON.stringify({'session': true}),
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      var res = await resp.json()
      return res.session
    },
    async getPublications()
    {
      var resp = await fetch('/api/getPublications',
      {
        method: 'GET',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      var res = await resp.json();
      return res;
    },
    async publicar()
    {
      let resp = await fetch('/api/publication/publish',
      {
        method: 'POST',
        body: JSON.stringify({'content': this.data.content}),
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let res = await resp.json();
      console.log(res.error);
      if(res.error) this.data.error = res.error;
      else console.log(res.estado);
      this.data.content = "";
      this.$forceUpdate();
    },
    closeAlert()
    {
      this.data.error = "";
      this.$forceUpdate();
    },
    error(errorMsg)
    {
      this.data.error = errorMsg;
      this.$forceUpdate()
    },
  }
}
</script>
