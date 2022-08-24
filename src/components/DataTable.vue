<template>
  <div class="rootcta">
    <div class="between:flex bottom:margin-3">
      <div class="center:flex-items">
        <span class="right:margin-1">Year</span>
        <select v-model="currentYear" class="select" @change="fetchPlayers">
          <option v-for="year in showYear" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="center:flex-items">
        <span class="right:margin-1">Scoring Format</span>
        <select
          v-model="currentScoringFormat"
          class="select"
          @change="fetchPlayers"
        >
          <option v-for="sf in showScoringFormat" :key="sf" :value="sf">
            {{ sf }}
          </option>
        </select>
      </div>

      <div class="center:flex-items">
        <span class="right:margin-1">Team Size</span>
        <select v-model="currentTeamSize" class="select" @change="fetchPlayers">
          <option v-for="ts in showTeamSize" :key="ts" :value="ts">
            {{ ts }}
          </option>
        </select>
      </div>

      <div class="end:flex"></div>
    </div>

    <table class="table table:border secondary-5:border">
      <thead>
        <tr>
          <th v-for="th in tableHeader" :key="th">
            <div class="between:flex center:items">
              <span>{{ th.text }}</span>
              <span @click.prevent="sortByColumn(th.name)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  v-bind:fill="this.sortcol[th.name]=='desc'?'red':'blue'"
                  class="bi bi-filter none:event"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </span>
            </div>
          </th>
        </tr>
        <tr>
          <td>
            <input
              type="search"
              class="input"
              placeholder="Filter name..."
              v-model="col.name"
              @keyup="filterByColumn"
              @search="fetchPlayers"
            />
          </td>
          <td>
            <select
              class="select"
              v-model="col.position"
              @change="filterByColumn"
            >
              <option value="">Filter position...</option>
              <option
                v-for="cd in uniqColumnData('position')"
                :key="cd"
                :value="cd"
              >
                {{ cd }}
              </option>
            </select>
          </td>
          <td>
            <select class="select" v-model="col.team" @change="filterByColumn">
              <option value="">Filter team...</option>
              <option
                v-for="cd in uniqColumnData('team')"
                :key="cd"
                :value="cd"
              >
                {{ cd }}
              </option>
            </select>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="td in tableData" :key="td">
          <td>{{ td.name }}</td>
          <td>{{ td.position }}</td>
          <td>{{ td.team }}</td>
          <td>{{ td.adp }}</td>
          <td>{{ td.times_drafted }}</td>
          <td>{{ td.high }}</td>
          <td>{{ td.low }}</td>
          <td>{{ td.bye }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { $array, $object } from "../assets/alga.js";
import axios from "axios";

export default {
  name: "DataTable",
  data() {
    return {
      columns: [
        { name: "name", text: "Name" },
        { name: "position", text: "Position" },
        { name: "team", text: "Team" },
        { name: "adp", text: "ADP" },
        { name: "times_drafted", text: "Drafted" },
        { name: "high", text: "High" },
        { name: "low", text: "Low" },
        { name: "bye", text: "Bye" },
      ],
      showYear: Array.from(
        { length: 11 },
        (_, i) => new Date().getFullYear() - i
      ),
      currentYear: new Date().getFullYear(),

      showTeamSize: ["8", "10", "12"],
      currentTeamSize: "12",

      showScoringFormat: ["standard", "ppr", "tdo"],
      currentScoringFormat: "standard",

      players: [],
      filteredPlayers: [],

      searchInput: "",

      col: {
        name: "",
        position: "",
        team: "",
        adp: "",
        drafted: "",
        high: "",
        low: "",
        bye: "",
      },
      sortcol: {
        name: "",
        position: "",
        team: "",
        adp: "",
        times_drafted: "",
        high: "",
        low: "",
        bye: "",
      },
    };
  },
  computed: {
    showInfo() {
      return $array.show(this.getCurrentPlayers())(this.currentPlayers);
    },
    tableHeader() {
      return this.columns;
    },
    tableData() {
      return this.filteredPlayers;
    },
  },
  created() {
    this.fetchPlayers();
  },
  methods: {
    async getAllPlayers(format, year, teamsize) {
      let url =
        "http://localhost:3333/players/" +
        format +
        "/" +
        year +
        "/" +
        teamsize;

      try {
        let res = await axios.get(url);
        // console.table(res.data.players);
        return res.data.players;
      } catch (error) {
        return [{ error }];
      }
    },
    fetchPlayers() {
      this.getAllPlayers(
        this.currentScoringFormat,
        this.currentYear,
        this.currentTeamSize
      ).then((res) => {
        this.players = res;
        this.filteredPlayers = this.players;
        this.sortcol = {};
        this.sortByColumn("times_drafted")
      });
    },
    searchEvent() {},
    getCurrentPlayers() {
      return this.players;
    },
    uniqColumnData(column) {
      return $array.unique(this.getCurrentPlayers(), column);
    },
    filterByColumn() {
      const filterCol = $object.removeBy("")(this.col);
      let filterData = this.getCurrentPlayers();
      if (Object.entries(filterCol).length >= 1) {
        filterData = $array.filtered(...Object.values(filterCol))(
          this.getCurrentPlayers(),
          Object.keys(filterCol)
        );
      } else {
        filterData = this.getCurrentPlayers();
      }
      this.filteredPlayers = filterData;
    },
    sortByColumn(column) {
      this.col = {
        name: "",
        position: "",
        team: "",
        adp: "",
        drafted: "",
        high: "",
        low: "",
        bye: "",
      };
      let sortedPlayers = this.getCurrentPlayers();
      const sortedColumn = this.sortcol[column];
      this.sortcol = {};
      if (sortedColumn === "desc") {
        this.sortcol[column] = "asc";
        sortedPlayers = $array.sorted(this.getCurrentPlayers())(column, "asc");
      } else {
        this.sortcol[column] = "desc";
        sortedPlayers = $array.sorted(this.getCurrentPlayers())(column, "desc");
      }
      this.filteredPlayers = sortedPlayers;
    },
  },
};
</script>
<style scoped>
.rootcta {
  margin: 50px;
}
</style>