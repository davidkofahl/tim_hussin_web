require 'sinatra/base'

module Sinatra

	module Menu

		def active_item?(item_path)

			request.path.include? item_path

		end

		def build(node)
			menu = ""
			i = 1.0
			node.each do |node|
				num = (i / 3).ceil
				path = node[:path]
				title = node[:title]
				id = node[:title].gsub(/\s+/, "-").downcase
				menu << "<li class='column-#{num} #{id}'>"
				menu << "<a class='menu-item #{active_item?(path) ? "active" : ""}' href='#{path}'>#{title}</a>"
				menu << "</li>" 
				i += 1 
			end
			menu
		end

	end

	helpers Menu

end
