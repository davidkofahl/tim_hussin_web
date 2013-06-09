class Gallery
	attr_accessor :node, :path, :count

	def initialize(node)
		@node = node
		@path = @node[:images][:path]
		@count = @node[:images][:count]
	end

	def title
		@node[:title]
	end

	def addZeros(num)
		value = ''
		if num < 10
			value = "0#{num}"
		else
			value = "#{num}"
		end
		value
	end

	def build
		html = ''
		i = 1	
		while i <= @count.to_i
			html << "<div id='gallery-#{i}' class='gallery-image'>"
			html << "<img src='http://s3.amazonaws.com/america_recycled/timhussin/#{@path + addZeros(i)}.jpg' />"
			html << "</div>"
			i += 1			
		end
		html
	end
end

