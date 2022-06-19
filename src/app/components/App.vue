<template>
    <div>
        <div v-show="data.error.state" class="alert alert-danger alert-dismissible fade show" role="alert" id="alert">
            {{data.error.error}}
            <button v-on:click="closeAlert" type="button" class="close" id="close-alert">
            <span>&times;</span>
            </button>
        </div>
        <div>
            <div v-if="!data.sesion" id="sign-container">
                <div v-if="data.logIn">
                    <form @submit.prevent="logIn" id="form-sign-in">
                        <div>
                            <input type="text" placeholder="Email o Usuario" class="text-sign" v-model="datos.dato">
                        </div>
                        <div>
                            <input type="password" placeholder="Password" class="text-sign" v-model="datos.password">
                        </div>
                        <button class="button-sign">Sign In</button>
                    </form>
                    <button v-on:click="changeForm" class="changeForm" >No tengo una cuenta</button>
                </div>
                <div v-else>
                    <form @submit.prevent="signUp">
                        <div>
                            <input class="text-sign" placeholder="name" v-model="datos.name" type="text">
                        </div>
                        <div>
                            <input class="text-sign" placeholder="user name" v-model="datos.user_name" type="text" name="" id="">
                        </div>
                        <div>
                            <input class="text-sign" placeholder="email" v-model="datos.email" type="text">
                        </div>
                        <div>
                            <input class="text-sign" placeholder="password" v-model="datos.password" type="password" name="" id="">
                        </div>
                        <button class="button-sign">Sign Up</button>
                    </form>
                    <button v-on:click="changeForm" class="changeForm">Ya tengo una cuenta</button>
                </div>
            </div>
            <div v-else>
                <div>
                    <div>
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
                                    <div class="user-name"><p>@{{item.user_name}}</p></div>
                                </div>  
                                <div class="fecha">
                                    <div></div>
                                    <div></div>
                                    <div class="fecha-fecha">{{item.date.split('.')[0].split('T')[0].replace('-', '/').replace('-', '/')}}</div>
                                    <div class="fecha-hora"><p>{{item.date.split('.')[0].split('T')[1].substring(0, 5)}}</p></div>
                                </div>
                            </div>
                            <div class="publication-content">
                                <p>{{item.contenido}}</p>
                            </div>
                        </div>
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
            data:
            {
                sesion: false,
                array: [],
                content: '',
                logIn: true,
                error: {
                    "state": false,
                    "error": 'Error por defecto' 
                }
            },
            datos:
            {
                dato: '',
                password: ''
            }
        }
    },
    mounted()
    {
        this.session().then(data => 
        {
            this.data.sesion = data
            this.getPublications().then(array =>
            {
                this.data.array = array;
                this.$forceUpdate();
            })
        })
    },
    methods:
    {
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
                if(data.error != '')
                {
                    console.log(data.error);
                    this.data.error.state = true;
                    this.data.error.error = data.error;
                    this.$forceUpdate();
                    return;
                }
                fetch('/api/initSession',
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(resp => 
                {
                    console.log(resp)
                    this.session().then(data => 
                    {
                        this.data.sesion = data
                        this.$forceUpdate();
                        location.reload();
                    })
                })
            })
        },
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
            if (res.sesion === 'true') return true;
            else return false;
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
            if(res.error != '')
            {
                this.data.error.state = true;
                this.data.error.error = res.error;
            }
            else console.log(res.estado);
            this.data.content = "";
            this.$forceUpdate();
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
            if (res.error != '')
            {
                this.data.error.state = true;
                this.data.error.error = res.error;
                this.$forceUpdate();
            }
            else
            {
                this.datos = {};
                location.reload();
            }
        },
        closeAlert()
        {
            this.data.error.state = false;
            this.$forceUpdate();
        }
    }

}
</script>
