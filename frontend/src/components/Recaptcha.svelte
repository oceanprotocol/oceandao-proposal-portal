<script>
  import { RECAPTCHA_KEY } from "../utils/config";

  export async function getCaptcha() {
    return new Promise((res) => {
      grecaptcha.ready(function () {
        grecaptcha
          .execute(RECAPTCHA_KEY, { action: "submit" })
          .then(function (t) {
            res(t);
            console.log(t);
          });
      });
    });
  }
</script>

<div class="g-recaptcha" data-sitekey={RECAPTCHA_KEY}>
  <slot />
</div>

<svelte:head>
  <script
    src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`}
    async
    defer></script>
</svelte:head>
