<template>
  <v-container>
    <NavBar :coins="coins"></NavBar>
    <v-container v-for="item in sports" :key="item.id">
      <EventsPage :id="item.id" :events="events" @changeCoins="changeCoins"/>
    </v-container>
  </v-container>
</template>

<script>

  import EventsPage from "../../components/public/EventsPage";
  import eventService from '../../api/services/event-service';
  import sportService from '../../api/services/sport-service';
  import NavBar from "../../components/public/NavBar";

  export default {
    components: {
      EventsPage,
      NavBar
    },
    data () {
      return {
        events: [],
        sports: [],
        coins: null
      }
    },
    methods:{
      changeCoins: function(betValue) {
        this.coins = betValue;
      },
      goTo: function(path, id){
        this.$router.push(path + '/' + id)
      }
    },
    mounted: function () {
      sportService.getAllSports()
              .then(response => {
                this.sports = response;
              })
              .catch(error => {
                this.displayErrorMessage('Event', error.message);
              });
      eventService.getAllOpenEvents()
              .then((eventsResponse) => {
                this.events = eventsResponse;
              })
              .catch((error) => {
                this.displayErrorMessage('Event', error.message);
              });
    }
  }
</script>