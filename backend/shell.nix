let
  mach-nix = import
    (builtins.fetchGit {
      url = "https://github.com/DavHau/mach-nix/";
      ref = "refs/tags/3.5.0";
    })
    {
      pypiDataRev = "7def05c2f169bc69abd2217e1410ef0cf0cd03c8";
    };
in
mach-nix.mkPythonShell {
  python = "python310";
  requirements = ''
    # dev
    pylint
    black

    # app
    Flask
    python-jwt
    gunicorn
    peewee
    # python-dateutil
    flask-compress
  '';
}
# pkgs.mkShell {
#   buildInputs = [ python ];
# }
