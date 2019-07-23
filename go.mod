module github.com/influxdata/chronograf

require (
	github.com/BurntSushi/toml v0.3.1
	github.com/Masterminds/semver v1.4.2
	github.com/NYTimes/gziphandler v0.0.0-20170104155701-6710af535839
	github.com/Sirupsen/logrus v0.0.0-20160829202321-3ec0642a7fb6
	github.com/alecthomas/kingpin v2.2.6+incompatible
	github.com/alecthomas/template v0.0.0-20160405071501-a0175ee3bccc
	github.com/alecthomas/units v0.0.0-20151022065526-2efee857e7cf
	github.com/apache/arrow v0.0.0-20190114124456-cf047fc67698
	github.com/apex/log v1.1.0
	github.com/aws/aws-sdk-go v1.16.18
	github.com/blakesmith/ar v0.0.0-20150311145944-8bd4349a67f2
	github.com/boltdb/bolt v0.0.0-20160719165138-5cc10bbbc5c1
	github.com/bouk/httprouter v0.0.0-20160817010721-ee8b3818a7f5
	github.com/caarlos0/ctrlc v1.0.0
	github.com/campoy/unique v0.0.0-20180121183637-88950e537e7e
	github.com/cespare/xxhash v1.1.0
	github.com/dgrijalva/jwt-go v0.0.0-20160831183534-24c63f56522a
	github.com/dustin/go-humanize v0.0.0-20171111073723-bb3d318650d4
	github.com/elazarl/go-bindata-assetfs v0.0.0-20160822204401-9a6736ed45b4
	github.com/fatih/color v1.7.0
	github.com/go-sql-driver/mysql v1.4.0
	github.com/gogo/protobuf v0.0.0-20180320105559-49944b4a4b08
	github.com/golang/protobuf v1.2.0
	github.com/google/go-cmp v0.2.0
	github.com/google/go-github v17.0.0+incompatible
	github.com/google/go-querystring v1.0.0
	github.com/goreleaser/goreleaser v0.97.0
	github.com/goreleaser/nfpm v0.9.7
	github.com/imdario/mergo v0.3.6
	github.com/influxdata/flux v0.25.0
	github.com/influxdata/influxdb v1.1.5
	github.com/influxdata/kapacitor v1.5.0
	github.com/influxdata/line-protocol v0.0.0-20180522152040-32c6aa80de5e
	github.com/influxdata/tdigest v0.0.0-20181121200506-bf2b5ad3c0a9
	github.com/influxdata/usage-client v0.0.0-20160829180054-6d3895376368
	github.com/jessevdk/go-flags v1.4.0
	github.com/jmespath/go-jmespath v0.0.0-20180206201540-c2b33e8439af
	github.com/kamilsk/retry v0.0.0-20181229152359-495c1d672c93
	github.com/kevinburke/go-bindata v0.0.0-20180120195511-46eb4c183bfc
	github.com/lib/pq v1.0.0
	github.com/mattn/go-colorable v0.0.9
	github.com/mattn/go-isatty v0.0.4
	github.com/mattn/go-zglob v0.0.1
	github.com/microcosm-cc/bluemonday v1.0.1
	github.com/mitchellh/go-homedir v1.0.0
	github.com/opentracing/opentracing-go v1.0.2
	github.com/pkg/errors v0.8.0
	github.com/satori/go.uuid v1.2.0
	github.com/segmentio/kafka-go v0.2.0
	github.com/sergi/go-diff v1.0.0
	github.com/tylerb/graceful v1.2.15
	go.uber.org/atomic v1.3.2
	go.uber.org/multierr v1.1.0
	go.uber.org/zap v1.9.1
	golang.org/x/net v0.0.0-20181023162649-9b4f9f5ad519
	golang.org/x/oauth2 v0.0.0-20181017192945-9dcd33a902f4
	golang.org/x/sync v0.0.0-20181221193216-37e7f081c4d4
	golang.org/x/sys v0.0.0-20181205085412-a5c9d58dba9a
	golang.org/x/tools v0.0.0-20190114164648-36f37f8f5c81
	google.golang.org/api v0.0.0-20170214011559-bc20c61134e1
	google.golang.org/appengine v1.2.0
	gopkg.in/yaml.v2 v2.2.2
	honnef.co/go/tools v0.0.0-20190102054323-c2f93a96b099
)

replace (
	go.uber.org/atomic v1.3.2 => github.com/uber-go/atomic v1.3.2
	go.uber.org/multierr v1.1.0 => github.com/uber-go/multierr v1.1.0
	go.uber.org/zap v1.9.1 => github.com/uber-go/zap v1.9.1

	golang.org/x/crypto v0.0.0-20180904163835-0709b304e793 => github.com/golang/crypto v0.0.0-20180904163835-0709b304e793

	golang.org/x/crypto v0.0.0-20181203042331-505ab145d0a9 => github.com/golang/crypto v0.0.0-20181203042331-505ab145d0a9
	golang.org/x/exp v0.0.0-20180321215751-8460e604b9de => github.com/golang/exp v0.0.0-20180321215751-8460e604b9de
	golang.org/x/exp v0.0.0-20181112044915-a3060d491354 => github.com/golang/exp v0.0.0-20181112044915-a3060d491354
	golang.org/x/net v0.0.0-20180724234803-3673e40ba225 => github.com/golang/net v0.0.0-20180724234803-3673e40ba225
	golang.org/x/net v0.0.0-20180906233101-161cd47e91fd => github.com/golang/net v0.0.0-20180906233101-161cd47e91fd
	golang.org/x/net v0.0.0-20181023162649-9b4f9f5ad519 => github.com/golang/net v0.0.0-20181023162649-9b4f9f5ad519
	golang.org/x/oauth2 v0.0.0-20181017192945-9dcd33a902f4 => github.com/golang/oauth2 v0.0.0-20181017192945-9dcd33a902f4
	golang.org/x/snappy v0.0.0-20180518054509-2e65f85255db => github.com/golang/snappy v0.0.0-20180518054509-2e65f85255d
	golang.org/x/sync v0.0.0-20180314180146-1d60e4601c6f => github.com/golang/snappy v0.0.0-20180518054509-2e65f85255db
	golang.org/x/sync v0.0.0-20181221193216-37e7f081c4d4 => github.com/golang/sync v0.0.0-20181221193216-37e7f081c4d4
	golang.org/x/sys v0.0.0-20180903190138-2b024373dcd9 => github.com/golang/sys v0.0.0-20180903190138-2b024373dcd9
	golang.org/x/sys v0.0.0-20181030150119-7e31e0c00fa0 => github.com/golang/sys v0.0.0-20181030150119-7e31e0c00fa0
	golang.org/x/sys v0.0.0-20181205085412-a5c9d58dba9a => github.com/golang/sys v0.0.0-20181205085412-a5c9d58dba9a
	golang.org/x/text v0.3.0 => github.com/golang/text v0.3.0
	golang.org/x/tools v0.0.0-20180525024113-a5b4c53f6e8b => github.com/golang/tools v0.0.0-20180525024113-a5b4c53f6e8b
	golang.org/x/tools v0.0.0-20181221154417-3ad2d988d5e2 => github.com/golang/tools v0.0.0-20181221154417-3ad2d988d5e2
	golang.org/x/tools v0.0.0-20190114164648-36f37f8f5c81 => github.com/golang/tools v0.0.0-20190114164648-36f37f8f5c81
	gonum.org/v1/gonum v0.0.0-20181121035319-3f7ecaa7e8ca => github.com/gonum/gonum v0.0.0-20181121035319-3f7ecaa7e8ca
	gonum.org/v1/netlib v0.0.0-20181029234149-ec6d1f5cefe6 => github.com/gonum/netlib v0.0.0-20181029234149-ec6d1f5cefe6
	google.golang.org/api v0.0.0-20170214011559-bc20c61134e1 => github.com/googleapis/google-api-go-client v0.0.0-20170214011559-bc20c61134e1
	google.golang.org/appengine v1.2.0 => github.com/golang/appengine v1.2.0
	gopkg.in/check.v1 v1.0.0-20180628173108-788fd7840127 => github.com/go-check/check v1.0.0-20180628173108-788fd7840127
	gopkg.in/src-d/go-billy.v4 v4.2.1 => github.com/src-d/go-billy v0.0.0-20180904090359-59952543636f
	gopkg.in/src-d/go-git-fixtures.v3 v3.1.1 => github.com/src-d/go-git-fixtures v3.1.1+incompatible
	gopkg.in/src-d/go-git.v4 v4.8.1 => github.com/src-d/go-git v0.0.0-20181127152218-3dbfb89e0f5b
	gopkg.in/warnings.v0 v0.1.2 => github.com/go-warnings/warnings v0.1.2
	gopkg.in/yaml.v2 v2.2.2 => github.com/go-yaml/yaml v0.0.0-20181115110504-51d6538a90f8
	honnef.co/go/tools v0.0.0-20190102054323-c2f93a96b099 => github.com/dominikh/go-tools v0.0.0-20190102054323-c2f93a96b099

)
