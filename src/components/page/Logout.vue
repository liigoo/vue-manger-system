<script>
    methods: {
        let self = this;
        localStorage.removeItem('ms_username');

        self.$router.push('/login');
        console.log('this.$router: ' + self.$router);
        alert('??');
    }
</script>
