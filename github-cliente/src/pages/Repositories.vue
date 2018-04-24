<template>
  <q-layout>

    <q-modal v-model="modalOpened" maximized>
      <q-modal-layout>
        <strong>Trocar de organização</strong>
        <hr>
        <q-field
          helper="Digite o número da organização do Github"
        >
          <q-input v-model="owner.link" float-label="Organização" />
        </q-field>
        <q-btn label="Pesquisar" @click="register" />
      </q-modal-layout>
    </q-modal>

    <q-layout-header>
      <q-toolbar color="primary">
        <q-toolbar-title>
          {{ owner.name }}
        </q-toolbar-title>
        <q-btn flat round dense icon="settings" @click="modalOpened = true" />
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-list v-if="owner.repositories.length > 0" highlight>
        <q-list-header>Lista de repositórios</q-list-header>

        <q-item
          v-for="(rep, index) in owner.repositories"
          :key="index"
          @click="details(rep)"
        >
          <q-item-main :label="rep.name" />
          <q-item-side right>
            {{ rep.stars }} estrelas
          </q-item-side>
        </q-item>
      </q-list>

      <q-alert v-else color="primary" style="margin: 10px">
        Sem repositórios ainda :(
      </q-alert>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Loading } from 'quasar'
import { repositories } from '../resources/github'

export default {
  data () {
    return {
      owner: {
        name: 'Sem organização selecionada',
        link: '',
        repositories: []
      },
      modalOpened: false
    }
  },
  created () {
    if ('owner' in this.$route.params) {
      this.owner.link = this.$route.params.owner
      setTimeout(() => {
        this.register()
      }, 500)
    }
  },
  methods: {
    register () {
      if (this.owner.link !== '') {
        this.owner.repositories = []
        this.modalOpened = false

        Loading.show({ message: 'Procurando repositórios' })

        repositories(this.owner.link).then((result) => {
          result = result.data
          if (result.length > 0) {

            this.owner.name = result[0].owner.login
            for (var i = 0; i < result.length; i++) {
              this.owner.repositories.push({
                name: result[i].name,
                stars: result[i].stargazers_count,
                full: result[i].full_name
              })
            }

            Loading.hide()
          }
        }).catch(() => {
          Loading.hide()
          this.modalOpened = true
        })
      }
    },
    details (r) {
      console.log(r)
      this.$router.push({name: 'details', params: {repository: r, owner: this.owner.link}})
    }
  }
}

</script>

<style>
</style>
