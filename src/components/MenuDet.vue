<style scoped>
  #navbody {
    width: 300px;
    height: 60px;
    background-color: rgb(255, 255, 255);
    border-radius: 40px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.041);
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .ul {
    list-style: none;
    width: 100%;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
  }

  .ul .li {
    display: inline-block;
  }

  .radio {
    display: none;
  }

  .svg {
    width: 70px;
    height: 70px;
    opacity: 80%;
    cursor: pointer;
    padding: 13px 20px;
    transition: 0.2s;
  }

  .ul .li .svg:hover {
    transition: 0.1s;
    color: rgb(235, 40, 176);
    position: relative;
    margin-top: -4px;
    opacity: 100%;
  }

  .radio:checked + label .li .svg {
    color: rgb(235, 40, 176);
    fill-rule: evenodd;
  }
</style>

<template>
  <div id="navbody">
    <form action="#">
      <ul class="ul">
        <input checked="" name="rad" class="radio" id="choose1" type="radio" />
        <label for="choose1">
          <li class="li">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="svg w-6 h-6 text-gray-800 dark:text-white""><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 17v-3h-20" /><path d="M2 8v9" /><path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5" /></svg>
          </li>
        </label>
        <input class="radio" name="rad" id="choose2" type="radio" />
        <label for="choose2">
          <li class="li">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-building"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21l18 0" /><path d="M9 8l1 0" /><path d="M9 12l1 0" /><path d="M9 16l1 0" /><path d="M14 8l1 0" /><path d="M14 12l1 0" /><path d="M14 16l1 0" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" /></svg>
          </li>
        </label>
        <input class="radio" name="rad" id="choose3" type="radio" />
        <label for="choose3">
          <li class="li">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              class="svg w-6 h-6 text-gray-800 dark:text-white"
            >
              <path
                d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke="currentColor"
              ></path>
            </svg>
          </li>
        </label>
        <input class="radio" name="rad" id="choose4" type="radio" />
        <label for="choose4">
          <li class="li">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              class="svg w-6 h-6 text-gray-800 dark:text-white"
            >
              <path
                d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="square"
                stroke="currentColor"
              ></path>
            </svg>
          </li>
        </label>
      </ul>
    </form>
  </div>
</template>
