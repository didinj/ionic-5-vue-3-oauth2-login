<template>
  <ion-page>
    <form @submit.prevent="handleSignup">
      <ion-card>
        <ion-item>
          <h3>Please Sign Up!</h3>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Username</ion-label>
          <ion-input v-model="form.username" id="username" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type="password" v-model="form.password" id="email" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Name</ion-label>
          <ion-input v-model="form.name" id="name" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-button type="submit" shape="round">
            Sign Up
            <ion-icon slot="end" :icon="personAdd"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <p>Already have an Account?</p>
        </ion-item>
        <ion-item>
          <ion-button type="button" shape="round" router-link="/signin">
            Sign In
            <ion-icon slot="end" :icon="logIn"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-card>
    </form>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonCard, IonItem, IonLabel, IonButton, IonInput, alertController, IonIcon } from '@ionic/vue'
import { logIn, personAdd } from 'ionicons/icons';
import { mapActions, mapGetters } from "vuex"

export default {
  name: 'Signup',
  components: { IonPage, IonCard, IonItem, IonLabel, IonButton, IonInput, IonIcon },
  setup() {
    return {
      logIn,
      personAdd
    };
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
        name: ""
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["authenticationError", "authenticationErrorCode"])
  },
  methods: {
    ...mapActions("auth", ["signup"]),
    async handleSignup() {
      if (
        this.form.name &&
        this.form.username &&
        this.form.password
      ) {
        const registerUser = {
          name: this.form.name,
          username: this.form.username,
          password: this.form.password
        };
        this.signup(registerUser).then(async() => {
          const alert = await alertController
            .create({
              header: 'Success',
              subHeader: 'Signup Success',
              message: 'Your username signup successfully.',
              buttons: ['OK'],
            });
          this.form.name = ""
          this.form.username = ""
          this.form.password = ""
          await alert.present()
        }).catch((err: any) => {
          console.log(err)
        })
      } else {
        const errorAlert = await alertController
            .create({
              header: 'Failed',
              subHeader: 'Signup Failed',
              message: 'You are not fill the form completely.',
              buttons: ['OK'],
            });
        await errorAlert.present
      }
    },

  }
}
</script>
