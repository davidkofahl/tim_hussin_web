require 'rubygems'
require 'sinatra/base'
require 'logger'
require 'date'
require 'pp'
require './content.rb'
require './helpers/gallery'
require './helpers/menu'


class App < Sinatra::Base

	helpers Sinatra::Menu

	configure do

	  set :root, File.dirname(__FILE__) 

	end

	def fetch_path 
		path = request.path
		unless path == "/"
			path = path.split("/")
		end
		path
	end

	###CONTROLLERS

	before do

		node = fetch_path

		@menu = $content[:menu]["children"]
		@photo_menu = $content[:menu]["children"][0]["children"]
		@video_menu = $content[:menu]["children"][1]["children"]

		if node.size > 2
			@node = $content[:galleries][node[1]][node[2]]
			if node[1] == "photography"
				unless @node.nil?
					@gallery = Gallery.new(@node)
				else
					halt 404
				end
			end
		end

		if node.size == 1
		end

	end  

	get "/" do
		@photo = "/images/index_bg.jpg"
		erb :index

	end

	get "/contact/?" do

		@photo = "/images/index_bg.jpg"
		erb :about

	end

	get "/photography/?" do
		@photo = "http://s3.amazonaws.com/america_recycled/timhussin/america_recycled/america_recycled_01.jpg"
		erb :index

	end

	get "/photography/*" do
		@photo = "http://s3.amazonaws.com/america_recycled/timhussin/america_recycled/america_recycled_01.jpg"
		erb :gallery

	end

	get "/video/?" do
		@photo = "http://s3.amazonaws.com/america_recycled/timhussin/starting_over/starting_over_05.jpg"
		erb :index

	end

	get "/video/*" do
		@photo = "http://s3.amazonaws.com/america_recycled/timhussin/starting_over/starting_over_05.jpg"
		erb :video

	end

	get "/tearsheets/?" do
		@photo = "/images/index_bg.jpg"
		erb :tearsheet

	end

	not_found do
		@photo = "/images/index_bg.jpg"
	  status 404 
	  erb :notfound  
	  
	end
end

