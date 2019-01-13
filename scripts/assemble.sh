#!/bin/bash
ROOT_DIR=${ROOT_DIR:-"$(dirname $(cd "$(dirname $0)";pwd) )"}
SRC_DIR=${SRC_DIR:-"$ROOT_DIR/repo"}
DEST_DIR=${DEST_DIR:-"$ROOT_DIR/results"}

SRCS=( $(find $SRC_DIR -maxdepth 1 -mindepth 1 -type d|while read l;do basename $l;done) )
TARGETS=""

help() {
	cat <<END
$0 [<target>]
target: all ${SRCS[*]}
END
}

produce() {
	local t=$1
	cat <<END
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Recettes - $t</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <style>
@media (max-width: 991px) {
  .content-header > .breadcrumb {
    position: relative;
    margin-top: 5px;
    top: 0;
    right: 0;
    float: none;
    padding-left: 10px;
  }
}

.content {
  min-height: 250px;
  padding: 15px;
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
}

/*
 * Modal
 * ----------------------
 */
/*
 * Box
 * ----------------------
 */
.box {
  position: relative;
  border-radius: 3px;
  margin-bottom: 20px;
  width: 100%;
}
.box.collapsed-box .box-body,
.box.collapsed-box .box-footer {
  display: none;
}
.box .nav-stacked > li {
  margin: 0;
}
.box .nav-stacked > li:last-of-type {
  border-bottom: none;
}
.box.height-control .box-body {
  max-height: 300px;
  overflow: auto;
}
.box.box-solid {
  border-top: 0;
}
.box.box-solid > .box-header .btn.btn-default {
  background: transparent;
}
.box.box-solid > .box-header .btn:hover,
.box.box-solid > .box-header a:hover {
  background: rgba(0, 0, 0, 0.1);
}

.box.box-solid > .box-header > .box-tools .btn {
  border: 0;
  box-shadow: none;
}
.box.box-solid[class*='bg'] > .box-header {
  color: #fff;
}
.box .box-group > .box {
  margin-bottom: 5px;
}
.box .knob-label {
  text-align: center;
  color: #333;
  font-weight: 100;
  font-size: 12px;
  margin-bottom: 0.3em;
}
.box > .overlay,
.overlay-wrapper > .overlay,
.box > .loading-img,
.overlay-wrapper > .loading-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.box .overlay,
.overlay-wrapper .overlay {
  z-index: 50;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 3px;
}
.box .overlay > .fa,
.overlay-wrapper .overlay > .fa {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -15px;
  margin-top: -15px;
  color: #000;
  font-size: 30px;
}
.box .overlay.dark,
.overlay-wrapper .overlay.dark {
  background: rgba(0, 0, 0, 0.5);
}
.box-header:before,
.box-body:before,
.box-footer:before,
.box-header:after,
.box-body:after,
.box-footer:after {
  content: " ";
  display: table;
}
.box-header:after,
.box-body:after,
.box-footer:after {
  clear: both;
}
.box-header {
  display: block;
  padding: 10px;
  position: relative;
}
.collapsed-box .box-header.with-border {
  border-bottom: none;
}
.box-header > .fa,
.box-header > .glyphicon,
.box-header > .ion,
.box-header .box-title {
  display: inline-block;
  font-size: 18px;
  margin: 0;
  line-height: 1;
}
.box-header > .fa,
.box-header > .glyphicon,
.box-header > .ion {
  margin-right: 5px;
}
.box-header > .box-tools {
  position: absolute;
  right: 10px;
  top: 5px;
}
.box-header > .box-tools [data-toggle="tooltip"] {
  position: relative;
}
.box-header > .box-tools.pull-right .dropdown-menu {
  right: 0;
  left: auto;
}
.box-header > .box-tools .dropdown-menu > li > a {
  color: #444!important;
}
.btn-box-tool {
  padding: 5px;
  font-size: 12px;
  background: transparent;
}
.btn-box-tool.btn:active {
  box-shadow: none;
}
.box-body {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 10px;
}
.no-header .box-body {
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.box-body > .table {
  margin-bottom: 0;
}
.box-body .fc {
  margin-top: 5px;
}
.box-body .full-width-chart {
  margin: -19px;
}
.box-body.no-padding .full-width-chart {
  margin: -9px;
}
.box-body .box-pane {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 3px;
}
.box-body .box-pane-right {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 0;
}
.box-footer {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 10px;
}
.box-header .box-icon {
	margin-right: 10px;
}
.box-header .box-icon img {
	margin:0;
	height: 32px;
	width: 32px;
}


/*
 * Others
 */
.content .btn,
.menu .btn {
	margin-right: 5px;
}
.content i.fa-download {
	color: black;
}
ul.userMenu {
	width: 300px;
}
span span.label {
	margin-left: 1px;
	margin-right: 1px;
}

.box-footer .panel-condensed .panel-body {
	padding:0;
}
.box-footer .panel-body .table-condensed {
	margin:0;
}

/* 
 * colors
 */
.box,
.commentList,
.tab-pane > .mdViewer,
.tab-content .table.table-hover,
.appItem,
.packageItem,
.box-footer {
  background-color: #ffffff;
}

.bg-red,
.bg-yellow,
.bg-aqua,
.bg-blue,
.bg-light-blue,
.bg-green,
.bg-navy,
.bg-teal,
.bg-olive,
.bg-lime,
.bg-orange,
.bg-fuchsia,
.bg-purple,
.bg-maroon,
.bg-black,
.bg-red-active,
.bg-yellow-active,
.bg-aqua-active,
.bg-blue-active,
.bg-light-blue-active,
.bg-green-active,
.bg-navy-active,
.bg-teal-active,
.bg-olive-active,
.bg-lime-active,
.bg-orange-active,
.bg-fuchsia-active,
.bg-purple-active,
.bg-maroon-active,
.bg-black-active,
.callout.callout-danger,
.callout.callout-warning,
.callout.callout-info,
.callout.callout-success,
.alert-success,
.alert-danger,
.alert-error,
.alert-warning,
.alert-info,
.label-danger,
.label-info,
.label-warning,
.label-primary,
.label-success,
.modal-primary .modal-body,
.modal-primary .modal-header,
.modal-primary .modal-footer,
.modal-warning .modal-body,
.modal-warning .modal-header,
.modal-warning .modal-footer,
.modal-info .modal-body,
.modal-info .modal-header,
.modal-info .modal-footer,
.modal-success .modal-body,
.modal-success .modal-header,
.modal-success .modal-footer,
.modal-danger .modal-body,
.modal-danger .modal-header,
.modal-danger .modal-footer {
  color: #fff !important;
}
.navbar .nav > li > a,
.navbar .navbar-header a.navbar-brand,
.box.box-solid.box-warning > .box-header,
.box.box-solid.box-warning > .box-header a,
.box.box-solid.box-warning > .box-header .btn,
.box.box-solid.box-success > .box-header,
.box.box-solid.box-success > .box-header a,
.box.box-solid.box-success > .box-header .btn,
.box.box-solid.box-danger > .box-header,
.box.box-solid.box-danger > .box-header a,
.box.box-solid.box-danger > .box-header .btn,
.box.box-solid.box-info > .box-header,
.box.box-solid.box-info > .box-header a,
.box.box-solid.box-info > .box-header .btn,
.box.box-solid.box-primary > .box-header,
.box.box-solid.box-primary > .box-header a,
.box.box-solid.box-primary > .box-header .btn {
  color: #ffffff;
}

.box-header.with-border,
.box .nav-stacked > li {
  border-bottom: 1px solid #f4f4f4;
}
.box .border-right {
  border-right: 1px solid #f4f4f4;
}
.box .border-left {
  border-left: 1px solid #f4f4f4;
}
.modal-header {
  border-bottom-color: #f4f4f4;
}
.modal-footer {
  border-top-color: #f4f4f4;
}
.box-footer {
  border-top: 1px solid #f4f4f4;
}


/*
 * Default
 */
.appItem,
.packageItem {
  border-top: 3px solid #d2d6de;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.box.box-default {
  border-top-color: #d2d6de;
}
.box.box-solid.box-default {
  border: 1px solid #d2d6de;
}
.login-page,
.register-page,
.box.box-solid.box-default > .box-header {
  background: #d2d6de;
  background-color: #d2d6de;
}
.box {
  border-top: 3px solid #d2d6de;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 991px) {
  .content-header > .breadcrumb {
    background: #d2d6de;
  }
  .content-header > .breadcrumb li:before {
    color: #97a0b3;
  }
}

/*
 * Primary
 */
.navbar {
  background-color: #307095;
}
.navbar .nav > li > a:hover,
.navbar .nav > li > a:active,
.navbar .nav > li > a:focus,
.navbar .nav .open > a,
.navbar .nav .open > a:hover,
.navbar .nav .open > a:focus,
.navbar .nav > .active > a {
  background: rgba(0, 0, 0, 0.1);
  color: #3c8dbc;
}
.bg-light-blue-active,
.modal-primary .modal-header,
.modal-primary .modal-footer {
  background-color: #357ca5 !important;
}
.modal-primary .modal-header,
.modal-primary .modal-footer {
  border-color: #307095;
}
.box.box-primary {
  border-top-color: #3c8dbc;
}
.box.box-solid.box-primary {
  border: 1px solid #3c8dbc;
}
.bg-light-blue,
.label-primary,
.modal-primary .modal-body,
.box.box-solid.box-primary > .box-header {
  background: #3c8dbc;
  background-color: #3c8dbc;
}

/*
 * Info
 */
.bg-aqua-active,
.modal-info .modal-header,
.modal-info .modal-footer {
  background-color: #00a7d0 !important;
}
.modal-info .modal-header,
.modal-info .modal-footer {
  border-color: #0097bc;
}
.box.box-info {
  border-top-color: #00c0ef;
}
.box.box-solid.box-info {
  border: 1px solid #00c0ef;
}
.bg-aqua,
.callout.callout-info,
.alert-info,
.label-info,
.modal-info .modal-body,
.box.box-solid.box-info > .box-header {
  background: #00c0ef;
  background-color: #00c0ef;
}

/*
 * Danger
 */
.bg-red-active,
.modal-danger .modal-header,
.modal-danger .modal-footer {
  background-color: #d33724 !important;
}
.modal-danger .modal-header,
.modal-danger .modal-footer {
  border-color: #c23321;
}
.box.box-danger {
  border-top-color: #dd4b39;
}
.box.box-solid.box-danger {
  border: 1px solid #dd4b39;
}
.bg-red,
.callout.callout-danger,
.alert-danger,
.alert-error,
.label-danger,
.modal-danger .modal-body,
.box.box-solid.box-danger > .box-header {
  background: #dd4b39;
  background-color: #dd4b39;
}

/*
 * Warning
 */
.bg-yellow-active,
.modal-warning .modal-header,
.modal-warning .modal-footer {
  background-color: #db8b0b !important;
}
.modal-warning .modal-header,
.modal-warning .modal-footer {
  border-color: #c87f0a;
}
.box.box-warning {
  border-top-color: #f39c12;
}
.box.box-solid.box-warning {
  border: 1px solid #f39c12;
}
.bg-yellow,
.callout.callout-warning,
.alert-warning,
.label-warning,
.modal-warning .modal-body,
.box.box-solid.box-warning > .box-header {
  background: #f39c12;
  background-color: #f39c12;
}

/*
 * Success
 */
.bg-green-active,
.modal-success .modal-header,
.modal-success .modal-footer {
  background-color: #008d4c !important;
}
.modal-success .modal-header,
.modal-success .modal-footer {
  border-color: #00733e;
}
.box.box-success {
  border-top-color: #00a65a;
}
.box.box-solid.box-success {
  border: 1px solid #00a65a;
}
.bg-green,
.callout.callout-success,
.alert-success,
.label-success,
.modal-success .modal-body,
.box.box-solid.box-success > .box-header {
  background: #00a65a;
  background-color: #00a65a;
}





body {
	background-color: #edf5fa;
}

.box.box-solid.box-default > .box-header,
.box.box-solid.box-default > .box-header a,
.box.box-solid.box-default > .box-header .btn,
.content-header > .breadcrumb > li > a,
.box-header,
.login-logo a,
.register-logo a {
  color: #444;
}
.login-box-body,
.register-box-body {
  color: #666;
}
.login-box-body .form-control-feedback,
.register-box-body .form-control-feedback {
  color: #777;
}
.btn-box-tool {
  color: #97a0b3;
}
.open .btn-box-tool,
.btn-box-tool:hover {
  color: #606c84;
}
.commentList .comment {
	background-color: #FAFAFA;
}
.commentList .comment.odd {
	background-color: #F0F0F0;
}
.commentList .comment .comment-left {
	border-right: 1px solid #CCC;
}
.commentList .comment .comment-text {
	border-left: 1px solid #CCC;
	margin-left: -1px;
}


    </style>
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <!-- d3-bootstrap -->
    <script src="https://cdn.jsdelivr.net/gh/sebt3/d3-bootstrap@0.5.2/dist/d3-bootstrap-withextra.min.js"></script>
    <script>
END
	cat $ROOT_DIR/js/*.js
	cat $SRC_DIR/$t/ingredients/*.js
	cat $SRC_DIR/$t/materiel/*.js
	cat $SRC_DIR/$t/recettes/*.js
	cat <<END
    </script>
  </head>
  <body class="">
    <div id="hidden"></div>
    <div class="container-fluid">
      <section class="content">
      </section>
    </div>
    <script>
	r.hidden();
	r.render();
    </script>
  </body>
</html>
END
}


if [ $# -gt 0 ];then
	case "$1" in
	all)	TARGETS=${SRCS[*]};;
	*)	for i in ${SRCS[*]};do
			if [ "$1" = "$i" ];then
				TARGETS=$i;
			fi
		done
		if [ -z "$TARGETS" ];then
			help
			echo "$1 is invalid";
			exit 1
		fi;;
	esac
else
	TARGETS=${SRCS[*]}
fi

for t in $TARGETS;do
	produce $t>"$DEST_DIR/${t}.html"
done
